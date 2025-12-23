import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "../types/tree.types";

interface SelectionStore {
  selectedNode: NodeApi<TreeNodeType> | null;
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}));
