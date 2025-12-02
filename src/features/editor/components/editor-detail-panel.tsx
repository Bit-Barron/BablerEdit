import React, { useMemo } from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/features/translation-parser/types/parser.types";
import { TreeNode } from "@/features/editor/types/editor.types";
import { Checkbox } from "@/core/components/ui/checkbox";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNode> | null;
  project: ParsedProject;
}

export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  if (!selectedNode || !selectedNode.isLeaf) return null;

  const key = selectedNode.data.id;

  const translations = useMemo(() => {
    const mainPackage = project.folder_structure.children[0];
    const conceptNode = mainPackage.children.find(
      (child) => child.name === key
    );
    return conceptNode?.translations ?? null;
  }, [project.folder_structure, key]);

  return (
    <section className="h-full flex flex-col bg-background">
      <div className="px-6 py-2.5 bg-muted border-b">
        <h2 className="font-semibold tracking-wide">{key}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {translations && translations.length > 0 ? (
          <div className="divide-y">
            {translations.map((t) => (
              <div key={t.language} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm tracking-wider text-muted-foreground">
                    {t.language.toUpperCase()}
                  </span>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Checkbox className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </button>
                </div>

                <input
                  type="text"
                  defaultValue={t.value}
                  className="w-full bg-muted/50 border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder={`Enter ${t.language} translation...`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No translations available
          </div>
        )}
      </div>
    </section>
  );
};
