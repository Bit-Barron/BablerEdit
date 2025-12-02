import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNode> | null;
  setSelectedNode: (node: NodeApi<TreeNode> | null) => void;
}

export const useEditorStore = create<EditorPageState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}));
