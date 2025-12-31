import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "@/lib/types/editor.types";
import { SetStateAction } from "react";

interface EditorStore {
  selectedNode: NodeApi<TreeNodeType> | null;
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void;

  onProjectClick: string;
  setOnProjectClick: (id: string) => void;

  currentRoute: string;
  setCurrentRoute: (route: string) => void;

  disabledButtons: boolean;
  setDisabledButtons: (disabled: boolean) => void;

  addIdDialogOpen: boolean;
  setAddIdDialogOpen: (open: boolean) => void;

  search: string;
  setSearch: (search: string) => void;
  commandPalettenOpen: boolean;
  setCommandPaletteOpen: (open: SetStateAction<boolean>) => void;

  configureLangDialogOpen: boolean;
  setConfigureLangDialogOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  search: "",
  setSearch: (search: string) => set({ search }),
  commandPalettenOpen: false,
  setCommandPaletteOpen: (open: SetStateAction<boolean>) =>
    set((state) => ({
      commandPalettenOpen:
        typeof open === "function" ? open(state.commandPalettenOpen) : open,
    })),
  configureLangDialogOpen: false,
  setConfigureLangDialogOpen: (open: boolean) =>
    set({ configureLangDialogOpen: open }),

  onProjectClick: "",
  setOnProjectClick: (id: string) => set({ onProjectClick: id }),
  currentRoute: "wizard",
  setCurrentRoute: (route: string) => set({ currentRoute: route }),
  disabledButtons: false,
  setDisabledButtons: (disabled: boolean) => set({ disabledButtons: disabled }),
  addIdDialogOpen: false,
  setAddIdDialogOpen: (open: boolean) => set({ addIdDialogOpen: open }),
}));
