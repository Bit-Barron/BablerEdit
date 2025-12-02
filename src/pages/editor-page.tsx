import React from "react";
import { Tree } from "react-arborist";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";
import { buildTranslationTree } from "@/features/editor/lib/build-translation-tree";
import { useEditorStore } from "@/features/editor/store/editor-page.store";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useFileManagerStore();
  const { selectedNode, setSelectedNode } = useEditorStore();

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
            onSelect={(nodes) => {
              if (nodes.length > 0) {
                setSelectedNode(nodes[0]);
              }
            }}
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
