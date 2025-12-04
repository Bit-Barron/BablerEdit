import { AutoSizedTree } from "@/core/components/elements/auto-sized-tree";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";
import { buildTranslationTree } from "@/features/editor/lib/translation-tree";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TreeNode } from "@/features/editor/types/editor.types";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { OpenIdDialog } from "@/features/id/components/open-id-dialog";
import { useIdStore } from "@/features/id/store/id.store";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useFileManagerStore();
  const { selectedNode, setSelectedNode } = useEditorStore();
  const { openIdDialog, setOpenIdDialog } = useIdStore();

  if (!parsedProject) return null;

  return (
    <div className="fixed inset-0 top-[89px] flex">
      <div className="w-[400px] border-r flex flex-col bg-background">
        <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
          <h2 className="font-semibold text-sm">Translation IDs</h2>
        </div>

        <AutoSizedTree
          initialData={buildTranslationTree(parsedProject)}
          openByDefault={false}
          indent={20}
          rowHeight={32}
          onSelect={(nodes) => {
            if (nodes.length > 0) {
              setSelectedNode(nodes[0] as NodeApi<TreeNode>);
            }
          }}
        >
          {(props) => (
            <TreeNodeComponent {...(props as NodeRendererProps<TreeNode>)} />
          )}
        </AutoSizedTree>
      </div>

      <div className="flex-1 overflow-hidden">
        <TranslationDetail
          selectedNode={selectedNode}
          project={parsedProject}
        />

        <OpenIdDialog open={openIdDialog} onOpenChange={setOpenIdDialog} />
      </div>
    </div>
  );
};
