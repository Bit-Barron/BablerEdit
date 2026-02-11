import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { NodeApi, NodeRendererProps, TreeApi } from "react-arborist";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEditor } from "@/hooks/use-editor";
import { useTranslation } from "@/hooks/use-translation";
import { TreeNodeType } from "@/lib/types/editor.types";
import { ChevronsRightLeftIcon } from "@/components/icons/chevrons-right-left";
import { ChevronsLeftRightIcon } from "@/components/icons/chevrons-left-right";
import { AddIdDialog } from "@/components/pages/wizard/add-id-dialog";
import { TranslationDetail } from "@/components/pages/editor/translation-detail";
import { TranslationTree } from "@/components/pages/editor/translation-tree";
import { TreeNode } from "@/components/pages/editor/tree-node";
import {
  TreeContextMenu,
  ContextMenuState,
} from "@/components/pages/editor/tree-context-menu";
import { buildTranslationTree } from "@/lib/helpers/tree-builder";
import "react-cmdk/dist/cmdk.css";
import CommandPalette, { getItemIndex } from "react-cmdk";
import { ConfigureLangDialog } from "@/components/pages/editor/configure-lang/configure-lang-dialog";
import { FilterDialog } from "./editor/set-filter/filter-dialog";
import { PreTranslateDialog } from "./editor/pre-translate/pre-translate-dialog";
import { RenameIdDialog } from "./editor/rename-id-dialog";
import { StatisticsDialog } from "./editor/statistics-dialog";
import { ConsistencyDialog } from "./editor/consistency-dialog";

export const EditorPage: React.FC = () => {
  const { parsedProject } = useProjectStore();
  const {
    addIdDialogOpen,
    setAddIdDialogOpen,
    selectedNode,
    selectedNodes,
    setSelectedNodes,
    setRenameDialogOpen,
    clipboardNodes,
    addClipboardNode,
    clearClipboard,
  } = useEditorStore();
  const { removeIdFromJson, duplicateId, pasteId } = useTranslation();
  const treeRef = useRef<TreeApi<TreeNodeType>>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleSelectId = useCallback(
    (id: string) => {
      const tree = treeRef.current;
      if (!tree) return;
      const node = tree.get(id);
      if (!node) return;
      node.openParents();
      node.select();
      tree.scrollTo(id);
      setSelectedNodes([node as NodeApi<TreeNodeType>]);
    },
    [setSelectedNodes],
  );

  const { moveJsonNode, commandPalette } = useEditor(handleSelectId);
  const [allExpanded, setAllExpanded] = useState(false);

  const initialTreeData = useMemo(() => {
    if (!parsedProject) return [];

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
          <button
            onClick={() => {
              if (allExpanded) {
                treeRef.current?.closeAll();
              } else {
                treeRef.current?.openAll();
              }
              setAllExpanded(!allExpanded);
            }}
            className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {allExpanded ? (
              <ChevronsRightLeftIcon size={20} />
            ) : (
              <ChevronsLeftRightIcon size={20} />
            )}
          </button>
        </div>
        <TranslationTree<TreeNodeType>
          treeRef={treeRef}
          data={initialTreeData}
          openByDefault={false}
          indent={24}
          rowHeight={40}
          onMove={moveJsonNode}
          onSelect={(nodes) => {
            setSelectedNodes(nodes as NodeApi<TreeNodeType>[]);
          }}
        >
          {(props) => (
            <TreeNode
              {...(props as NodeRendererProps<TreeNodeType>)}
              onClick={(node, isMultiSelect) => {
                if (isMultiSelect) {
                  // Toggle selection for multi-select
                  const isAlreadySelected = selectedNodes.some(
                    (n) => n.id === node.id,
                  );
                  if (isAlreadySelected) {
                    setSelectedNodes(
                      selectedNodes.filter((n) => n.id !== node.id),
                    );
                  } else {
                    setSelectedNodes([
                      ...selectedNodes,
                      node as NodeApi<TreeNodeType>,
                    ]);
                  }
                } else {
                  setSelectedNodes([node as NodeApi<TreeNodeType>]);
                }
              }}
              onContextMenu={(e, node) => {
                node.select();
                setSelectedNodes([node as NodeApi<TreeNodeType>]);
                setContextMenu({ node, x: e.clientX, y: e.clientY });
              }}
            />
          )}
        </TranslationTree>
        <TreeContextMenu
          contextMenu={contextMenu}
          onClose={() => setContextMenu(null)}
          canPaste={clipboardNodes.length > 0}
          onRename={(node) => {
            setSelectedNodes([node as NodeApi<TreeNodeType>]);
            setRenameDialogOpen(true);
          }}
          onDelete={(node) => {
            setSelectedNodes([node as NodeApi<TreeNodeType>]);
            removeIdFromJson();
          }}
          onDuplicate={(node) => {
            duplicateId(node.data.id);
          }}
          onCut={() => {
            selectedNodes.forEach((node) => {
              if (node.isLeaf) {
                addClipboardNode({ id: node.data.id, mode: "cut" });
              }
            });
          }}
          onCopy={() => {
            selectedNodes.forEach((node) => {
              if (node.isLeaf) {
                addClipboardNode({ id: node.data.id, mode: "copy" });
              }
            });
          }}
          onPaste={async (node) => {
            if (!clipboardNodes.length) return;
            let targetParentId: string | null = null;
            if (node.isLeaf) {
              const parts = node.data.id.split(".");
              targetParentId =
                parts.length > 1 ? parts.slice(0, -1).join(".") : null;
            } else {
              targetParentId = node.data.id;
            }
            const items = [...clipboardNodes];
            clearClipboard();
            let currentProject = parsedProject;
            for (const item of items) {
              const result = await pasteId(
                item.id,
                targetParentId,
                item.mode,
                currentProject,
              );
              if (result) {
                currentProject = result;
              }
            }
          }}
        />
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
        <PreTranslateDialog />
        <RenameIdDialog />
        <StatisticsDialog />
        <ConsistencyDialog />
      </div>
    </div>
  );
};
