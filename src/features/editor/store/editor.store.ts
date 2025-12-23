import { NodeApi } from "react-arborist";
import { create } from "zustand";
import { TreeNodeType } from "../types/tree.types";
import { Translation } from "@/features/project/types/project.types";

interface EditorStore {
  selectedNode: NodeApi<TreeNodeType> | null;
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void;

  translationForKey: Translation[];
  setTranslationForKey: (translations: Translation[]) => void;

  updateTranslation: string;
  setUpdateTranslation: (value: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  translationForKey: [],
  setTranslationForKey: (translations) =>
    set({ translationForKey: translations }),

  updateTranslation: "",
  setUpdateTranslation: (value) => set({ updateTranslation: value }),
}));
