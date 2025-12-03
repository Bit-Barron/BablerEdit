import { create } from "zustand";

interface ToolbarStore {
  currentPage: "editor" | "save-project" | "wizard";
  setCurrentPage: (page: "editor" | "save-project" | "wizard") => void;
  isToolbarItemEnabled: (itemId: string) => boolean;
}
export const useToolbarStore = create<ToolbarStore>((set, get) => ({
  currentPage: "wizard",

  isToolbarItemEnabled: (itemId: string) => {
    const page = get().currentPage;

    if (itemId === "open") {
      return page === "wizard";
    }
    if (itemId === "save") {
      return page === "editor";
    }
    if (itemId === "add-id") {
      return page === "editor";
    }
    if (itemId === "remove-ids") {
      return page === "editor";
    }
    if (itemId === "filter") return false;
    if (itemId === "pre-translate") return false;
    if (itemId === "consistency") return false;
    if (itemId === "languages") return false;

    return false;
  },

  setCurrentPage: (page) => set({ currentPage: page }),
}));
