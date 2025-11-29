import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor";

interface EditorPageState {
  selectedNode: NodeApi<TreeNode> | null;
  setSelectedNode: (node: NodeApi<TreeNode> | null) => void;
}

export const useEditorPageStore = create<EditorPageState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}));
