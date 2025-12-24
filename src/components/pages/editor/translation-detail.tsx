import React, { useEffect } from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/lib/types/project.types";
import { Input } from "@/components/ui/input";
import { TreeNodeType } from "@/lib/types/tree.types";
import { useTranslation } from "@/hooks/use-translation";
import { useTranslationStore } from "@/lib/store/translation.store";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNodeType>;
  project: ParsedProject;
}
export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { translationForKey, setTranslationForKey } = useTranslationStore();
  const { toggleApproved } = useTranslation();

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

      <div className="flex-1 overflow-y-auto px-8 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-8">
          {translationForKey.map((t) => {
            return (
              <div
                key={t.language}
                className="bg-card border-2 border-border rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-base tracking-wide uppercase text-foreground bg-primary/10 px-4 py-1.5 rounded-md border border-primary/20">
                    {t.language}
                  </span>
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Checkbox
                      checked={t.approved}
                      onCheckedChange={() => toggleApproved(t.language)}
                      className="w-4 h-4"
                    />
                    <span>Approved</span>
                  </label>
                </div>

                <Input
                  type="text"
                  value={t.value}
                  className="w-full text-base px-4 py-3 bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md transition-all"
                  placeholder={`Enter ${t.language} translation...`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
