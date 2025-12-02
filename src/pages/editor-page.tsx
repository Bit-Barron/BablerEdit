import React from "react";
import { Tree } from "react-arborist";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";
import { useEditorHook } from "@/features/editor/hook";
import { buildTranslationTree } from "@/features/editor/lib/tree-builder";

export const EditorPage: React.FC = () => {
  const { parsedProject, selectedNode, handleNodeSelect } = useEditorHook();

  if (!parsedProject) return null;

  return (
    <div className="fixed inset-0 top-[89px] flex">
      <div className="w-[400px] border-r flex flex-col bg-background">
        <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
          <h2 className="font-semibold text-sm">Translation IDs</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tree
            initialData={buildTranslationTree(parsedProject)}
            openByDefault={false}
            width="100%"
            indent={20}
            rowHeight={32}
            onSelect={handleNodeSelect}
          >
            {(props) => <TreeNodeComponent {...props} />}
          </Tree>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TranslationDetail
          selectedNode={selectedNode}
          project={parsedProject}
        />
      </div>
    </div>
  );
};
