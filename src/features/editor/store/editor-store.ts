import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNode> | null;
  setSelectedNode: (node: NodeApi<TreeNode> | null) => void;

  editTranslations: Map<string, Map<string, string>>;
  isDirty: boolean;

  updateTranslation: (
    nodeId: string,
    language: string,
    newText: string
  ) => void;

  hasChanges: (nodeId: string, language: string) => boolean;
}

export const useEditorPageStore = create<EditorPageState>((set, get) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  editTranslations: new Map(),
  isDirty: false,

  updateTranslation: (nodeId, language, newText) =>
    set((state) => {
      const updatedTranslations = new Map(state.editTranslations);
      const nodeTranslations = new Map(
        updatedTranslations.get(nodeId) || new Map<string, string>()
      );

      nodeTranslations.set(language, newText);
      updatedTranslations.set(nodeId, nodeTranslations);

      return {
        editTranslations: updatedTranslations,
        isDirty: true,
      };
    }),

  hasChanges: (nodeId, language) => {
    const state = get();
    return state.editTranslations.get(nodeId)?.has(language) ?? false;
  },
}));
