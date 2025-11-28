import { create } from "zustand";

interface EditorPageState {
  selectedNode: any | null;

  setSelectedNode: (node: any | null) => void;
}

export const useEditorPageStore = create<EditorPageState>((set) => ({
  selectedNode: null,

  setSelectedNode: (node) => set({ selectedNode: node }),
}));
