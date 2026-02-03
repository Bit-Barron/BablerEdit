import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useNotification } from "@/components/elements/toast-notification";
import * as TranslationService from "@/lib/services/translation.service";
import { useTranslationStore } from "@/lib/store/translation.store";
import { ParsedProject } from "@/lib/types/project.types";
import { delay } from "@/lib/utils/translation";
import { translateText } from "@/lib/helpers/translate-text";
import { writeTextFile } from "@tauri-apps/plugin-fs";


export const useTranslation = () => {
  const { selectedNode, setSelectedNode } = useEditorStore();
  const { parsedProject, setParsedProject, primaryLanguageCode } = useProjectStore();
  const { addNotification } = useNotification();
  const {
    setTranslationForKey,
    setDisplayComment,
    setTranslationUrls,
    translationUrls,
  } = useTranslationStore();

  const addIdToJson = async (value: string) => {
    try {
      const result = TranslationService.addTranslationId({
        selectedNodeId: selectedNode?.data.id || "",
        newIdValue: value,
        project: parsedProject!,
      });

      addNotification({
        type: "success",
        title: "ID added!",
        description: `"${value}" added successfully`,
      });
      const updatedProject = await result;
      setParsedProject(updatedProject as ParsedProject);
      return updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to add ID",
        description: message,
      });
    }
  };

  const removeIdFromJson = async () => {
    try {
      if (!selectedNode) {
        addNotification({
          type: "error",
          title: "No selection",
          description: "Please select a node to remove its ID.",
        });
        return;
      }
      const result = TranslationService.removeTranslationId({
        selectedNodeId: selectedNode!.data.id,
        project: parsedProject!,
      });

      setSelectedNode(null);
      addNotification({
        type: "success",
        title: "ID removed!",
        description: `ID removed successfully`,
      });
      const updatedProject = await result;
      setParsedProject(updatedProject);
      return updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to remove ID",
        description: message,
      });
    }
  };

  const toggleApproved = (language: string) => {
    if (!selectedNode || !parsedProject) return;

    try {
      const result = TranslationService.toggleTranslationApproval({
        project: parsedProject,
        language,
        selectedNodeId: selectedNode,
      });
      setParsedProject(result.updatedProject);
      setTranslationForKey(result.updatedTranslations);

      addNotification({
        type: "success",
        title: "Translation updated",
        description: "Approval status toggled successfully.",
      });
      return result.updatedProject;
    } catch (err) {
      console.error(err);
      addNotification({
        type: "error",
        title: "Error",
        description: "Failed to toggle approval status.",
      });
    }
  };

  const changeTranslationValue = async (newValue: string, language: string) => {
    try {
      const result = await TranslationService.updateTranslations({
        project: parsedProject!,
        selectedNode: selectedNode!,
        language,
        newValue,
      });

      setParsedProject(result.updatedProject);
      setTranslationForKey(result.updatedTranslations);

      addNotification({
        type: "success",
        title: "Translation updated",
        description: "Translation value updated successfully.",
      });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to update translation",
        description: message,
      });
    }
  };

  const addComment = (comment: string) => {
    try {
      const result = TranslationService.addCommentToTranslationId({
        project: parsedProject!,
        selectedNodeId: selectedNode!,
        comment,
      });

      setParsedProject(result.updatedProject);
      setDisplayComment(comment);

      addNotification({
        type: "success",
        title: "Translation updated",
        description: "Comment added successfully.",
      });

      return result.updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to add comment",
        description: message,
      });
    }
  };

  const handleDeleteLanguage = async (url: string) => {
    try {
      if (!parsedProject) return;

      const TRANSLATION = url.split("/").pop();
      const result = await TranslationService.removeTranslationUrl({
        project: parsedProject,
        translation: TRANSLATION!,
      });

      setParsedProject(result);

      setTranslationUrls(translationUrls.filter((u) => u !== url));

    } catch (err) {
      addNotification({
        type: "error",
        title: "Failed to add comment",
      })

      console.error(err)
    }
  };

  const handleTranslation = async (langs: any[], options: string[], selectedModel: string) => {
    try {
      const getNewAddedLangs = langs.filter((l) => l.newAddedlanguage).map((t) => t.code);
      let counter = 0;

      if (!getNewAddedLangs.length) {
        addNotification({
          type: "error",
          title: "No new language selected",
          description: "Please select at least one new language to translate.",
        });
        return;
      }

      const langCode = getNewAddedLangs[0];

      const updatedLanguages = parsedProject.languages.some((l) => l.code === langCode)
        ? parsedProject.languages
        : [...parsedProject.languages, { code: langCode }];

      const updatedTranslationPackages = parsedProject.translation_packages.map((pkg) => {
        if (pkg.translation_urls.some((url) => url.language === langCode)) return pkg;
        return {
          ...pkg,
          translation_urls: [
            ...pkg.translation_urls,
            { path: `${langCode}.json`, language: langCode },
          ],
        };
      });

      let currentProject: ParsedProject = {
        ...parsedProject,
        languages: updatedLanguages,
        translation_packages: updatedTranslationPackages,
      };

      const initialJson: Record<string, any> = {};
      const existingConcepts = currentProject.folder_structure.children[0].children;
      for (const concept of existingConcepts) {
        const keys = concept.name.split(".");
        let cur = initialJson;
        for (let k = 0; k < keys.length - 1; k++) {
          if (!cur[keys[k]]) cur[keys[k]] = {};
          cur = cur[keys[k]];
        }
        cur[keys[keys.length - 1]] = "";
      }
      await writeTextFile(
        `${parsedProject.source_root_dir}${langCode}.json`,
        JSON.stringify(initialJson, null, 2)
      );

      setParsedProject(currentProject);

      const concepts = currentProject.folder_structure.children[0].children;

      for (let i = 0; i < concepts.length; i++) {
        const primaryTranslation = concepts[i].translations.find(
          (t) => t.language === primaryLanguageCode
        );

        if (!primaryTranslation?.value) continue;

        counter += 1;
        addNotification({
          type: "info",
          title: "Translating...",
          description: `Translating text ${counter} of ${concepts.length} to ${langCode}.`,
        });

        const translated: any = await translateText(
          primaryTranslation.value,
          primaryLanguageCode,
          langCode,
          selectedModel
        );

        currentProject = {
          ...currentProject,
          folder_structure: {
            ...currentProject.folder_structure,
            children: currentProject.folder_structure.children.map((pkg) => ({
              ...pkg,
              children: pkg.children.map((concept) => {
                if (concept.name !== concepts[i].name) return concept;

                const hasLang = concept.translations.some((t) => t.language === langCode);
                const updatedTranslations = hasLang
                  ? concept.translations.map((t) =>
                    t.language === langCode ? { ...t, value: translated } : t
                  )
                  : [...concept.translations, { language: langCode, value: translated, approved: false }];

                return { ...concept, translations: updatedTranslations };
              }),
            })),
          },
        };

        setParsedProject(currentProject);
        await delay(1000);
      }

      // Write the new language file to disk
      const newLangJson: Record<string, any> = {};
      const allConcepts = currentProject.folder_structure.children[0].children;
      for (const concept of allConcepts) {
        const translation = concept.translations.find((t) => t.language === langCode);
        const keys = concept.name.split(".");
        let current = newLangJson;
        for (let k = 0; k < keys.length - 1; k++) {
          if (!current[keys[k]]) current[keys[k]] = {};
          current = current[keys[k]];
        }
        current[keys[keys.length - 1]] = translation?.value ?? "";
      }

      const filePath = `${parsedProject.source_root_dir}${langCode}.json`;
      await writeTextFile(filePath, JSON.stringify(newLangJson, null, 2));
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failed to translate",
        description: "An error occurred during translation.",
      });
      console.error(err);
    }
  };

  return {
    addComment,
    toggleApproved,
    addIdToJson,
    removeIdFromJson,
    changeTranslationValue,
    handleDeleteLanguage,
    handleTranslation,
  };
};
