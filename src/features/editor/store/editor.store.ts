import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNode> | undefined;
  setSelectedNode: (node: NodeApi<TreeNode> | undefined) => void;

  updateTranslation: string;
  setUpdateTranslation: (value: string) => void;
}

export const useEditorStore = create<EditorPageState>((set) => ({
  selectedNode: undefined,
  setSelectedNode: (node) => set({ selectedNode: node }),

  updateTranslation: "",
  setUpdateTranslation: (value) => set({ updateTranslation: value }),
}));
