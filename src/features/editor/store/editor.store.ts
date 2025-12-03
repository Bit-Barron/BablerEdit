import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNode>;
  setSelectedNode: (node: NodeApi<TreeNode>) => void;

  updateTranslation: string;
  setUpdateTranslation: (value: string) => void;
}

export const useEditorStore = create<EditorPageState>((set) => ({
  selectedNode: null as unknown as NodeApi<TreeNode>,
  setSelectedNode: (node) => set({ selectedNode: node }),

  updateTranslation: "",
  setUpdateTranslation: (value) => set({ updateTranslation: value }),
}));
