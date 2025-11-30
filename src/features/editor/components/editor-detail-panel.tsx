import React from "react";
import { NodeApi } from "react-arborist";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Checkbox } from "@/core/components/ui/checkbox";
import { TreeNode } from "../types/editor";
import { ParsedProject } from "@/features/parser/types/parser";
import { useEditorPageStore } from "../store/editor-store";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNode> | null;
  project: ParsedProject;
}

export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { editTranslations, updateTranslation, hasChanges } =
    useEditorPageStore();

  const translationKey = selectedNode?.data.id as string;

  if (!selectedNode || !selectedNode.isLeaf || !project) return;

  return (
    <section>
      {!selectedNode ||
        !selectedNode.isLeaf ||
        (!project && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a translation key
          </div>
        ))}

      <div className="flex flex-col h-full">
        <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
          <h2 className="font-semibold text-sm">{translationKey}</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="divide-y">
            {Array.from(project.languages.entries()).map(
              ([langCode, langData]) => {
                const value = langData.translations[translationKey] || "";
                const isChanged = hasChanges(selectedNode.data.id, langCode);

                return (
                  <div key={langCode} className="p-4 flex items-center gap-4">
                    <div className="w-16 text-sm font-medium uppercase">
                      {langCode}
                    </div>

                    <div className="flex-1">
                      <Input
                        className={`w-full ${
                          isChanged ? "border-yellow-400" : ""
                        }`}
                        value={
                          editTranslations
                            .get(selectedNode.data.id)
                            ?.get(langCode) ?? value
                        }
                        onChange={(e) =>
                          updateTranslation(
                            selectedNode.data.id,
                            langCode,
                            e.target.value
                          )
                        }
                        placeholder={
                          langCode === project.primaryLanguage
                            ? "Enter translation..."
                            : ""
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id={`approved-${langCode}`} />
                      <Label
                        htmlFor={`approved-${langCode}`}
                        className="text-xs text-muted-foreground"
                      >
                        Approved
                      </Label>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
