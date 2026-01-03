
import { create } from "zustand"
import type { NodeApi } from "react-arborist"
import type { TreeNodeType } from "@/lib/types/editor.types"
import type { SetStateAction } from "react"
import type { ParsedProject } from "../types/project.types"

interface EditorStore {
  selectedNode: NodeApi<TreeNodeType> | null
  setSelectedNode: (node: NodeApi<TreeNodeType> | null) => void

  onProjectClick: string
  setOnProjectClick: (id: string) => void

  currentRoute: string
  setCurrentRoute: (route: string) => void

  disabledButtons: boolean
  setDisabledButtons: (disabled: boolean) => void

  addIdDialogOpen: boolean
  setAddIdDialogOpen: (open: boolean) => void

  search: string
  setSearch: (search: string) => void

  commandPalettenOpen: boolean
  setCommandPaletteOpen: (open: SetStateAction<boolean>) => void

  configureLangDialogOpen: boolean
  setConfigureLangDialogOpen: (open: boolean) => void

  removeLangDialogOpen: boolean
  setRemoveLangDialogOpen: (open: boolean) => void

  languageToAdd: string[]
  setLanguageToAdd: (langs: string[]) => void

  addLangDialogOpen: boolean
  setAddLangDialogOpen: (open: boolean) => void

  selectedLanguage: string[]
  setSelectedLanguage: (selectedLanguage: string[]) => void

  filterDialogOpen: boolean
  setFilterDialogOpen: (filterDialogOpen: boolean) => void

  translationId: string
  setTranslationId: (translationId: string) => void

  translationText: string
  setTranslationText: (translationText: string) => void

  translationTextStatus: string
  setTranslationTextStatus: (translationTextStatus: string) => void

  approvalStateStatus: string
  setApprovalStateStatus: (approvalStateStatus: string) => void

  usageStatus: string
  setUsageStatus: (usageStatus: string) => void

  preTranslateDialog: boolean;
  setPreTranslateDialog: (preTranslateDialog: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  preTranslateDialog: false,
  translationTextStatus: "any",
  approvalStateStatus: "any",
  usageStatus: "any",
  selectedNode: null,
  search: "",
  languageToAdd: [],
  selectedLanguage: [],
  filterDialogOpen: false,
  commandPalettenOpen: false,
  newParsedProject: {} as ParsedProject,
  addLangDialogOpen: false,
  translationId: "",
  translationText: "",
  configureLangDialogOpen: false,
  removeLangDialogOpen: false,
  addIdDialogOpen: false,
  onProjectClick: "",
  currentRoute: "wizard",
  disabledButtons: false,
  setTranslationTextStatus: (translationTextStatus) => set({ translationTextStatus }),
  setApprovalStateStatus: (approvalStateStatus: string) => set({ approvalStateStatus }),
  setUsageStatus: (usageStatus: string) => set({ usageStatus }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSelectedLanguage: (selectedLanguage: string[]) => set({ selectedLanguage }),
  setFilterDialogOpen: (filterDialogOpen: boolean) => set({ filterDialogOpen: filterDialogOpen }),
  setLanguageToAdd: (langs: string[]) => set({ languageToAdd: langs }),
  setSearch: (search: string) => set({ search }),
  setCommandPaletteOpen: (open: SetStateAction<boolean>) =>
    set((state) => ({
      commandPalettenOpen: typeof open === "function" ? open(state.commandPalettenOpen) : open,
    })),

  setPreTranslateDialog: (open) => set({ preTranslateDialog: open }),

  setAddLangDialogOpen: (open: boolean) => set({ addLangDialogOpen: open }),
  setTranslationId: (translationId: string) => set({ translationId }),
  setTranslationText: (translationText: string) => set({ translationText }),
  setConfigureLangDialogOpen: (open: boolean) => set({ configureLangDialogOpen: open }),
  setRemoveLangDialogOpen: (open: boolean) => set({ removeLangDialogOpen: open }),

  setOnProjectClick: (id: string) => set({ onProjectClick: id }),
  setCurrentRoute: (route: string) => set({ currentRoute: route }),
  setDisabledButtons: (disabled: boolean) => set({ disabledButtons: disabled }),
  setAddIdDialogOpen: (open: boolean) => set({ addIdDialogOpen: open }),
}))
