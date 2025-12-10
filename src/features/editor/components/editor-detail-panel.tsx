import React from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { TreeNode } from "@/features/editor/types/editor.types";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Input } from "@/core/components/ui/input";
import { useEditorStore } from "../store/editor.store";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNode>;
  project: ParsedProject;
}
export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { setUpdateTranslation } = useEditorStore();

  const findTranslationForKey = () => {
    const mainPackage = project.folder_structure.children[0];
    const conceptNode = mainPackage.children.find(
      (child) => child.name === selectedNode!.data.id
    )?.translations;
    return conceptNode;
  };

  return (
    <section className="flex flex-col bg-background">
      <div className="px-6 py-2.5 bg-muted/30 border-b">
        <h2 className="font-semibold tracking-wide">{selectedNode!.data.id}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {findTranslationForKey() && (
          <div className="divide-y">
            {findTranslationForKey()!.map((t) => (
              <div key={t.language} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm tracking-wider text-muted-foreground">
                    {t.language.toUpperCase()}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Checkbox className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </label>
                </div>

                <Input
                  type="text"
                  value={t.value}
                  onChange={(e) => {
                    setUpdateTranslation(e.target.value);
                  }}
                  className="w-full border-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={`Enter ${t.language} translation...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
