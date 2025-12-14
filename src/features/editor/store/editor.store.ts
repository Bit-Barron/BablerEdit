import { create } from "zustand";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "../types/tree.types";
import { Translation } from "@/features/project/types/project.types";

interface EditorPageState {
  selectedNode: NodeApi<TreeNodeType> | null;
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void;

  updateTranslation: string;
  setUpdateTranslation: (value: string) => void;

  translationForKey: Translation[];
  setTranslationForKey: (translations: Translation[]) => void;

  value: string;
  setValue: (value: string) => void;

  openIdDialog: boolean;
  setOpenIdDialog: (isOpen: boolean) => void;
}

export const useEditorStore = create<EditorPageState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),

  translationForKey: [],
  setTranslationForKey: (translations) =>
    set({ translationForKey: translations }),

  updateTranslation: "",
  setUpdateTranslation: (value) => set({ updateTranslation: value }),

  value: "",
  setValue: (value) => set({ value }),
  openIdDialog: false,
  setOpenIdDialog: (isOpen) => set({ openIdDialog: isOpen }),
}));
