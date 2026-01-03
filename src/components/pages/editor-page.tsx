import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { useMemo } from "react";
import { useEditor } from "@/hooks/use-editor";
import { TreeNodeType } from "@/lib/types/editor.types";
import { ChevronsRightLeftIcon } from "@/components/icons/chevrons-right-left";
import { AddIdDialog } from "@/components/pages/wizard/add-id-dialog";
import { TranslationDetail } from "@/components/pages/editor/translation-detail";
import { TranslationTree } from "@/components/pages/editor/translation-tree";
import { TreeNode } from "@/components/pages/editor/tree-node";
import { buildTranslationTree } from "@/lib/helpers/tree-builder";
import "react-cmdk/dist/cmdk.css";
import CommandPalette, { getItemIndex } from "react-cmdk";
import { ConfigureLangDialog } from "@/components/pages/editor/configure-lang/configure-lang-dialog";
import { FilterDialog } from "./editor/set-filter/filter-dialog";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useProjectStore();
  const { addIdDialogOpen, setAddIdDialogOpen, selectedNode, setSelectedNode } =
    useEditorStore();
  const { moveJsonNode, commandPalette } = useEditor();


  const initialTreeData = useMemo(() => {
    if (!parsedProject) return [];

    console.log(parsedProject)
    const tree = buildTranslationTree(parsedProject);
    return tree;
  }, [parsedProject]);

  const selectedLeafNode = selectedNode?.isLeaf ? selectedNode : null;

  return (
    <div className="fixed inset-0 top-22 flex bg-background mt-2">
      <CommandPalette
        onChangeSearch={commandPalette.setSearch}
        onChangeOpen={commandPalette.setIsOpen}
        search={commandPalette.search}
        isOpen={commandPalette.isOpen}
        page="root"
      >
        <CommandPalette.Page id="root">
          {commandPalette.filteredItems.length ? (
            commandPalette.filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(commandPalette.filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPalette.List>
            ))
          ) : (
            <CommandPalette.FreeSearchAction />
          )}
        </CommandPalette.Page>
      </CommandPalette>

      <div className="w-87.5 border-r-2 border-border flex flex-col bg-background">
        <div className="border-b-2 border-t-2 border-border bg-secondary/50 px-6 py-4 shrink-0 flex justify-between items-center">
          <h2 className="font-bold text-base tracking-tight">
            Translation IDs
          </h2>
          <ChevronsRightLeftIcon className="opacity-60 hover:opacity-100 transition-opacity" />
        </div>
        <TranslationTree<TreeNodeType>
          data={initialTreeData}
          openByDefault={false}
          indent={24}
          rowHeight={40}
          onMove={moveJsonNode}
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
        {selectedLeafNode && parsedProject ? (
          <TranslationDetail
            selectedNode={selectedLeafNode}
            project={parsedProject}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary/30">
            <p className="text-muted-foreground text-lg">
              Select a translation key to edit
            </p>
          </div>
        )}
        <AddIdDialog open={addIdDialogOpen} onOpenChange={setAddIdDialogOpen} />
        <ConfigureLangDialog />
        <FilterDialog />
      </div>
    </div>
  );
};
