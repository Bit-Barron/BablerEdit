import { AutoSizedTree } from "@/core/components/elements/auto-sized-tree";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";
import { buildTranslationTree } from "@/features/editor/lib/translation-tree";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TreeNode } from "@/features/editor/types/editor.types";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { AddIdDialog } from "@/features/id/components/add-id-dialog";
import { useIdStore } from "@/features/id/store/id.store";
import { useMemo } from "react";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useFileManagerStore();
  const { selectedNode, setSelectedNode } = useEditorStore();
  const { openIdDialog, setOpenIdDialog } = useIdStore();

  const treeData = useMemo(() => {
    if (!parsedProject) return [];
    return buildTranslationTree(parsedProject);
  }, [parsedProject]);

  const treeKey =
    parsedProject?.folder_structure.children[0]?.children.length || 0;

  const selectedLeafNode = selectedNode?.isLeaf ? selectedNode : null;

  return (
    <div className="fixed inset-0 top-[89px] flex">
      <div className="w-[400px] border-r flex flex-col bg-background">
        <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
          <h2 className="font-semibold text-sm">Translation IDs</h2>
        </div>

        <AutoSizedTree
          key={treeKey}
          initialData={treeData}
          openByDefault={false}
          indent={20}
          rowHeight={32}
          onSelect={(nodes) => {
            if (nodes.length > 0) {
              setSelectedNode(nodes[0] as NodeApi<TreeNode>);
            } else {
              setSelectedNode(null);
            }
          }}
        >
          {(props) => (
            <TreeNodeComponent {...(props as NodeRendererProps<TreeNode>)} />
          )}
        </AutoSizedTree>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedLeafNode ? (
          <TranslationDetail
            selectedNode={selectedLeafNode}
            project={parsedProject}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a translation key to edit</p>
          </div>
        )}

        <AddIdDialog open={openIdDialog} onOpenChange={setOpenIdDialog} />
      </div>
    </div>
  );
};
