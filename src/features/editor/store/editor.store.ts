import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "../types/tree.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNodeType> | null;
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void;

  updateTranslation: string;
  setUpdateTranslation: (value: string) => void;
}
export const useEditorStore = create<EditorPageState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  updateTranslation: "",
  setUpdateTranslation: (value) => set({ updateTranslation: value }),
}));
