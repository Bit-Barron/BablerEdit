import React, { useEffect } from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/lib/types/project.types";
import { TreeNodeType } from "@/lib/types/tree.types";
import { useTranslation } from "@/hooks/use-translation";
import { useTranslationStore } from "@/lib/store/translation.store";
import { Separator } from "@/components/ui/separator";
import { TranslationInput } from "@/components/elements/translation-input";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNodeType>;
  project: ParsedProject;
}
export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { translationForKey, setTranslationForKey } = useTranslationStore();
  const { toggleApproved, changeTranslationValue } = useTranslation();

  useEffect(() => {
    const findTranslationForKey = () => {
      const mainPackage = project.folder_structure.children[0];
      const conceptNode = mainPackage.children.find(
        (child) => child.name === selectedNode!.data.id
      );

      setTranslationForKey(conceptNode!.translations);
    };

    findTranslationForKey();
  }, [selectedNode]);

  return (
    <section className="flex flex-col bg-background h-full">
      <div className="px-6 py-4 bg-secondary/50 border-b-2 border-t-2 border-border flex justify-between items-center">
        <h2 className="font-bold text-base tracking-tight">Translations</h2>
        <div className="flex items-center gap-4">
          {project.languages.map((lang, idx) => (
            <React.Fragment key={lang.code}>
              <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-md border border-primary/20">{`${
                lang.code
              }-${lang.code.toUpperCase()}`}</div>
              {idx < project.languages.length - 1 && (
                <Separator orientation="vertical" className="h-5" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="px-6 py-3 bg-muted/30 border-b border-border">
        <h1 className="font-semibold text-sm text-muted-foreground tracking-wide">
          {selectedNode.data.id}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4">
          {translationForKey.map((t) => {
            return (
              <TranslationInput
                key={t.language}
                translation={t}
                toggleApproved={toggleApproved}
                changeTranslationValue={changeTranslationValue}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
