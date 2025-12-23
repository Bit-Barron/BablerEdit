import React from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/features/project/types/project.types";
import { Checkbox } from "@/core/components/icons/checkbox";
import { Input } from "@/core/components/ui/input";
import { Separator } from "@/core/components/ui/seperator";
import { TreeNodeType } from "@/features/editor/types/tree.types";
import { useTranslation } from "@/features/editor/hooks/use-translation";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNodeType>;
  project: ParsedProject;
}

export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { currentTranslations, toggleApproved, updateValue } = useTranslation();

  return (
    <section className="flex flex-col bg-secondary h-screen">
      <div className="px-6 py-2.5 bg-secondary border-border-subtle border-b border-t flex justify-between">
        <h2 className="font-semibold tracking-wide">Translations</h2>
        <div className="flex items-center gap-2">
          {project.languages.map((lang) => (
            <React.Fragment key={lang.code}>
              <div className="text-sm">{`${
                lang.code
              }-${lang.code.toUpperCase()}`}</div>
              <Separator orientation="vertical" className="h-4" />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="px-6 py-2.5 bg-muted/30 text-sm">
        <h1 className="font-semibold">{selectedNode.data.id}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {currentTranslations.map((t) => {
            return (
              <div key={t.language} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm tracking-wider text-muted-foreground">
                    {t.language.toUpperCase()}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Checkbox
                      checked={t.approved}
                      onCheckedChange={() => toggleApproved(t.language)}
                      className="w-3.5 h-3.5"
                    />
                    <span>Approved</span>
                  </label>
                </div>

                <Input
                  type="text"
                  value={t.value}
                  onChange={(e) => updateValue(t.language, e.target.value)}
                  className="w-full border-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
