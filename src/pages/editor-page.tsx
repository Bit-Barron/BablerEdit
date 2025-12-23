import { buildTranslationTree } from "@/features/editor/lib/editor-utils";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { useProjectStore } from "@/features/project/store/project.store";
import { TreeNode } from "@/features/editor/components/tree/tree-node";
import { TranslationTree } from "@/features/editor/components/tree/translation-tree";
import { TranslationDetail } from "@/features/editor/components/translation-detail/translation-detail";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { AddIdDialog } from "@/features/editor/components/dialogs/add-id-dialog";
import { useMemo } from "react";
import { useEditorHook } from "@/features/editor/hooks/use-editor";
import { TreeNodeType } from "@/features/editor/types/tree.types";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useProjectStore();
  const { selectedNode, setSelectedNode } = useEditorStore();
  const { openIdDialog, setOpenIdDialog } = useEditorStore();
  const { handleJsonMove } = useEditorHook();

  const initialTreeData = useMemo(() => {
    if (!parsedProject) return [];
    return buildTranslationTree(parsedProject);
  }, [parsedProject]);

  const treeKey =
    parsedProject?.folder_structure.children[0]?.children.length || 0;

  const selectedLeafNode = selectedNode?.isLeaf ? selectedNode : null;

  return (
    <div className="fixed inset-0 top-22 flex">
      <div className="w-100 border-r border-border-subtle flex flex-col bg-background">
        <div className="border-b border-t border-border-subtle bg-secondary px-4 py-3 shrink-0">
          <h2 className="font-semibold text-sm">Translation IDs</h2>
        </div>
        <TranslationTree
          key={treeKey}
          data={initialTreeData}
          openByDefault={false}
          indent={20}
          rowHeight={32}
          //@ts-ignore
          onMove={handleJsonMove}
          onSelect={(nodes) => {
            if (nodes.length > 0) {
              setSelectedNode(nodes[0] as NodeApi<TreeNodeType>);
            } else {
              setSelectedNode(null);
            }
          }}
        >
          {(props) => (
            <TreeNode {...(props as NodeRendererProps<TreeNodeType>)} />
          )}
        </TranslationTree>
      </div>
      <div className="flex-1 overflow-hidden">
        {selectedLeafNode ? (
          <TranslationDetail
            selectedNode={selectedLeafNode}
            project={parsedProject}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary">
            <p>Select a translation key to edit</p>
          </div>
        )}
        <AddIdDialog open={openIdDialog} onOpenChange={setOpenIdDialog} />
      </div>
    </div>
  );
};
