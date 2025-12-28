import { useProjectStore } from "@/lib/store/project.store";

import { NodeApi, NodeRendererProps } from "react-arborist";
import { useMemo, useState, useEffect } from "react";
import { useEditor } from "@/hooks/use-editor";
import { TreeNodeType } from "@/lib/types/tree.types";
import { ChevronsRightLeftIcon } from "@/components/icons/chevrons-right-left";
import { AddIdDialog } from "@/components/pages/wizard/add-id-dialog";
import { useSelectionStore } from "@/lib/store/selection.store";
import { TranslationDetail } from "@/components/pages/editor/translation-detail";
import { TranslationTree } from "@/components/pages/editor/translation-tree";
import { TreeNode } from "@/components/pages/editor/tree-node";
import { buildTranslationTree } from "@/lib/helpers/tree-builder";
import "react-cmdk/dist/cmdk.css";
import CommandPalette, {
  filterItems,
  getItemIndex,
  useHandleOpenCommandPalette,
} from "react-cmdk";

interface EditorPageProps {
  openIdDialog: boolean;
  setOpenIdDialog: (open: boolean) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  openIdDialog,
  setOpenIdDialog,
}) => {
  const { parsedProject } = useProjectStore();
  const { selectedNode, setSelectedNode } = useSelectionStore();
  const { moveJsonNode } = useEditor();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");

  useHandleOpenCommandPalette(setCommandPaletteOpen);

  const filteredItems = filterItems(
    [
      {
        heading: "Actions",
        id: "actions",
        items: [
          {
            id: "add-translation",
            children: "Add Translation ID",
            icon: "PlusIcon",
            onClick: () => {
              setOpenIdDialog(true);
            },
          },
          {
            id: "search-translations",
            children: "Search Translations",
            icon: "MagnifyingGlassIcon",
            onClick: () => {
              // Focus search or open search
            },
          },
        ],
      },
      {
        heading: "Navigation",
        id: "navigation",
        items: [
          {
            id: "home",
            children: "Home",
            icon: "HomeIcon",
            href: "#",
          },
          {
            id: "settings",
            children: "Settings",
            icon: "CogIcon",
            href: "#",
          },
        ],
      },
    ],
    search
  );

  const initialTreeData = useMemo(() => {
    if (!parsedProject) return [];
    return buildTranslationTree(parsedProject);
  }, [parsedProject]);

  const selectedLeafNode = selectedNode?.isLeaf ? selectedNode : null;

  return (
    <div className="fixed inset-0 top-22 flex bg-background mt-2">
      <CommandPalette
        onChangeSearch={setSearch}
        onChangeOpen={setCommandPaletteOpen}
        search={search}
        isOpen={commandPaletteOpen}
        page="root"
      >
        <CommandPalette.Page id="root">
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
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

      <div className="w-[350px] border-r-2 border-border flex flex-col bg-background">
        <div className="border-b-2 border-t-2 border-border bg-secondary/50 px-6 py-4 shrink-0 flex justify-between items-center">
          <h2 className="font-bold text-base tracking-tight">
            Translation IDs
          </h2>
          <ChevronsRightLeftIcon className="opacity-60 hover:opacity-100 transition-opacity" />
        </div>
        <TranslationTree
          data={initialTreeData}
          openByDefault={false}
          indent={24}
          rowHeight={40}
          //@ts-ignore
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
        <AddIdDialog open={openIdDialog} onOpenChange={setOpenIdDialog} />
      </div>
    </div>
  );
};
