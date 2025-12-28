import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "@/lib/types/tree.types";

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
}

export const useEditorStore = create<EditorStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  onProjectClick: "",
  setOnProjectClick: (id: string) => set({ onProjectClick: id }),
  currentRoute: "wizard",
  setCurrentRoute: (route: string) => set({ currentRoute: route }),
  disabledButtons: false,
  setDisabledButtons: (disabled: boolean) => set({ disabledButtons: disabled }),
  addIdDialogOpen: false,
  setAddIdDialogOpen: (open: boolean) => set({ addIdDialogOpen: open }),
}));
