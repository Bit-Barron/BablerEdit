import React, { useMemo, useState } from "react";
import { useEditorStore } from "@/lib/store/editor.store";
import { useProjectStore } from "@/lib/store/project.store";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Button } from "@/components/ui/retroui/button";
import { validateAllPlaceholders, PlaceholderValidationResult } from "@/lib/helpers/placeholder-validator";
import { translateText } from "@/lib/helpers/translate-text";
import { useNotification } from "@/components/elements/toast-notification";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { AlertTriangleIcon, SearchIcon, Wand2Icon } from "lucide-react";

interface ConsistencyIssue {
  type: "duplicate-source" | "placeholder" | "empty";
  ids: string[];
  language?: string;
  description: string;
}

export const ConsistencyDialog: React.FC = () => {
  const { consistencyDialogOpen, setConsistencyDialogOpen, selectedModel } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const { addNotification } = useNotification();
  const [tab, setTab] = useState<"consistency" | "placeholders">("consistency");
  const [isFixing, setIsFixing] = useState(false);

  const consistencyIssues = useMemo<ConsistencyIssue[]>(() => {
    if (!parsedProject?.folder_structure?.children?.[0]?.children) return [];
    const concepts = parsedProject.folder_structure.children[0].children;
    const issues: ConsistencyIssue[] = [];

    // Find empty translations
    for (const concept of concepts) {
      for (const t of concept.translations) {
        if (!t.value || t.value.trim() === "") {
          issues.push({
            type: "empty",
            ids: [concept.name],
            language: t.language,
            description: `"${concept.name}" is missing translation for ${t.language.toUpperCase()}`,
          });
        }
      }
    }

    // Find duplicate source texts with different translations
    const primaryLang = parsedProject.primary_language;
    const sourceMap = new Map<string, { id: string; translations: Map<string, string> }[]>();

    for (const concept of concepts) {
      const primaryT = concept.translations.find((t) => t.language === primaryLang);
      if (!primaryT?.value) continue;

      const key = primaryT.value.toLowerCase().trim();
      if (!sourceMap.has(key)) {
        sourceMap.set(key, []);
      }
      const transMap = new Map<string, string>();
      for (const t of concept.translations) {
        transMap.set(t.language, t.value);
      }
      sourceMap.get(key)!.push({ id: concept.name, translations: transMap });
    }

    for (const [sourceText, entries] of sourceMap) {
      if (entries.length < 2) continue;

      for (const lang of parsedProject.languages) {
        if (lang.code === primaryLang) continue;
        const uniqueTranslations = new Set(
          entries
            .map((e) => e.translations.get(lang.code)?.toLowerCase().trim())
            .filter(Boolean)
        );
        if (uniqueTranslations.size > 1) {
          issues.push({
            type: "duplicate-source",
            ids: entries.map((e) => e.id),
            language: lang.code,
            description: `Same source text "${sourceText.substring(0, 40)}${sourceText.length > 40 ? "..." : ""}" has ${uniqueTranslations.size} different ${lang.code.toUpperCase()} translations across: ${entries.map((e) => e.id).join(", ")}`,
          });
        }
      }
    }

    return issues;
  }, [parsedProject]);

  const placeholderIssues = useMemo<PlaceholderValidationResult[]>(() => {
    if (!parsedProject?.folder_structure?.children?.[0]?.children) return [];
    return validateAllPlaceholders(
      parsedProject.folder_structure.children[0].children,
      parsedProject.primary_language,
      parsedProject.framework
    );
  }, [parsedProject]);

  const emptyTranslationIssues = useMemo(() => {
    return consistencyIssues.filter((i) => i.type === "empty");
  }, [consistencyIssues]);

  const handleFixAll = async () => {
    if (!parsedProject || emptyTranslationIssues.length === 0) return;

    setIsFixing(true);
    let fixedCount = 0;
    let currentProject = parsedProject;

    // Use the selected model from pre-translate, default to NVIDIA if not set
    const modelToUse = selectedModel || "nvidia:meta/llama-3.3-70b-instruct";

    addNotification({
      type: "info",
      title: "Auto-fixing translations...",
      description: `Translating ${emptyTranslationIssues.length} missing translations using AI.`,
    });

    // Group issues by language for efficiency
    const issuesByLanguage = new Map<string, ConsistencyIssue[]>();
    for (const issue of emptyTranslationIssues) {
      if (!issue.language) continue;
      if (!issuesByLanguage.has(issue.language)) {
        issuesByLanguage.set(issue.language, []);
      }
      issuesByLanguage.get(issue.language)!.push(issue);
    }

    let failedCount = 0;
    let aborted = false;

    try {
      for (const [targetLang, issues] of issuesByLanguage) {
        if (aborted) break;

        for (const issue of issues) {
          if (aborted) break;

          const concept = currentProject.folder_structure.children[0].children.find(
            (c) => c.name === issue.ids[0]
          );
          if (!concept) continue;

          const primaryTranslation = concept.translations.find(
            (t) => t.language === parsedProject.primary_language
          );

          if (!primaryTranslation?.value) continue;

          // Skip if already translated
          const existingTranslation = concept.translations.find(
            (t) => t.language === targetLang && t.value && t.value.trim() !== ""
          );
          if (existingTranslation) continue;

          try {
            const translated = await translateText(
              primaryTranslation.value,
              parsedProject.primary_language,
              targetLang,
              modelToUse
            );

            // Update the project
            currentProject = {
              ...currentProject,
              folder_structure: {
                ...currentProject.folder_structure,
                children: currentProject.folder_structure.children.map((pkg) => ({
                  ...pkg,
                  children: pkg.children.map((c) => {
                    if (c.name !== concept.name) return c;

                    const hasLang = c.translations.some((t) => t.language === targetLang);
                    const updatedTranslations = hasLang
                      ? c.translations.map((t) =>
                          t.language === targetLang
                            ? { ...t, value: translated }
                            : t
                        )
                      : [
                          ...c.translations,
                          {
                            language: targetLang,
                            value: translated,
                            approved: false,
                          },
                        ];

                    return { ...c, translations: updatedTranslations };
                  }),
                })),
              },
            };

            setParsedProject(currentProject);
            fixedCount++;
            // Reset fail streak on success
            failedCount = 0;

            // Small delay to prevent rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (err) {
            console.error(`Failed to translate ${issue.ids[0]} to ${targetLang}:`, err);
            failedCount++;

            // Stop after 2 consecutive failures — likely a provider-level issue
            if (failedCount >= 2) {
              aborted = true;
              addNotification({
                type: "error",
                title: "Auto-fix stopped",
                description: `Provider error: ${err instanceof Error ? err.message : "Unknown error"}. Please select a different model in Pre-Translate settings.`,
              });
            }
          }
        }

        // Save the language file to disk after all translations for this language
        if (fixedCount > 0) {
          try {
            const langJson: Record<string, any> = {};
            const allConcepts = currentProject.folder_structure.children[0].children;
            for (const concept of allConcepts) {
              const translation = concept.translations.find(
                (t) => t.language === targetLang
              );
              const keys = concept.name.split(".");
              let current = langJson;
              for (let k = 0; k < keys.length - 1; k++) {
                if (!current[keys[k]]) current[keys[k]] = {};
                current = current[keys[k]];
              }
              current[keys[keys.length - 1]] = translation?.value ?? "";
            }

            const filePath = `${currentProject.source_root_dir}${targetLang}.json`;
            await writeTextFile(filePath, JSON.stringify(langJson, null, 2));
          } catch (err) {
            console.error(`Failed to save ${targetLang}.json:`, err);
          }
        }
      }

      if (!aborted) {
        addNotification({
          type: "success",
          title: "Auto-fix complete!",
          description: `Successfully translated ${fixedCount} missing translations.`,
        });
      } else if (fixedCount > 0) {
        addNotification({
          type: "warning",
          title: "Auto-fix partially complete",
          description: `Translated ${fixedCount} before stopping due to errors. Try a different model.`,
        });
      }
    } catch (err) {
      addNotification({
        type: "error",
        title: "Auto-fix failed",
        description: err instanceof Error ? err.message : "Unknown error occurred",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Dialog open={consistencyDialogOpen} onOpenChange={setConsistencyDialogOpen}>
      <Dialog.Content className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
          Validation & Consistency Check
        </Dialog.Header>

        <div className="px-6 py-3 border-b border-border flex gap-2">
          <Button
            variant={tab === "consistency" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("consistency")}
          >
            <SearchIcon size={14} className="mr-1" />
            Consistency ({consistencyIssues.filter((i) => i.type === "duplicate-source").length})
          </Button>
          <Button
            variant={tab === "placeholders" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("placeholders")}
          >
            <AlertTriangleIcon size={14} className="mr-1" />
            Placeholders ({placeholderIssues.length})
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 min-h-[300px] max-h-[50vh]">
          {tab === "consistency" && (
            <>
              {consistencyIssues.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No consistency issues found.
                </div>
              ) : (
                consistencyIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-sm ${
                      issue.type === "empty"
                        ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
                        : "border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon
                        size={16}
                        className={
                          issue.type === "empty"
                            ? "text-amber-500 mt-0.5"
                            : "text-red-500 mt-0.5"
                        }
                      />
                      <div>
                        <div className="font-medium">{issue.description}</div>
                        {issue.language && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Language: {issue.language.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === "placeholders" && (
            <>
              {placeholderIssues.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No placeholder issues found.
                </div>
              ) : (
                placeholderIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon size={16} className="text-amber-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          {issue.id} ({issue.language.toUpperCase()})
                        </div>
                        {issue.missing.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            Missing: {issue.missing.join(", ")}
                          </div>
                        )}
                        {issue.extra.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            Extra: {issue.extra.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <Dialog.Footer className="px-6 pb-6 flex justify-between">
          <Button
            variant="default"
            onClick={handleFixAll}
            disabled={isFixing || emptyTranslationIssues.length === 0}
            className="gap-2"
          >
            <Wand2Icon size={16} />
            {isFixing ? "Fixing..." : `Auto-fix Missing (${emptyTranslationIssues.length})`}
          </Button>
          <Button onClick={() => setConsistencyDialogOpen(false)}>Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
