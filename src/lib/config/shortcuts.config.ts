export interface ShortcutDef {
  id: string;
  label: string;
  keys: string;
  category: string;
  editorOnly?: boolean;
}

export const SHORTCUTS: ShortcutDef[] = [
  // File
  { id: "newProject", label: "New Project", keys: "mod+n", category: "File" },
  { id: "openProject", label: "Open Project", keys: "mod+o", category: "File" },
  { id: "saveProject", label: "Save Project", keys: "mod+s", category: "File" },
  { id: "closeProject", label: "Close Project", keys: "mod+w", category: "File" },

  // Edit
  { id: "findTranslation", label: "Find Translation", keys: "mod+f", category: "Edit", editorOnly: true },
  { id: "addId", label: "Add ID", keys: "mod+shift+a", category: "Edit", editorOnly: true },
  { id: "deleteSelected", label: "Delete Selected", keys: "Delete", category: "Edit", editorOnly: true },
  { id: "rename", label: "Rename", keys: "F2", category: "Edit", editorOnly: true },
  { id: "cut", label: "Cut", keys: "mod+x", category: "Edit", editorOnly: true },
  { id: "copy", label: "Copy", keys: "mod+c", category: "Edit", editorOnly: true },
  { id: "paste", label: "Paste", keys: "mod+v", category: "Edit", editorOnly: true },
  { id: "duplicate", label: "Duplicate", keys: "mod+d", category: "Edit", editorOnly: true },
  { id: "copyId", label: "Copy ID", keys: "mod+alt+1", category: "Edit", editorOnly: true },
  { id: "copyIdQuoted", label: "Copy ID (quoted)", keys: "mod+alt+2", category: "Edit", editorOnly: true },

  // View
  { id: "zoomIn", label: "Zoom In", keys: "mod+=", category: "View" },
  { id: "zoomOut", label: "Zoom Out", keys: "mod+-", category: "View" },
  { id: "zoomReset", label: "Reset Zoom", keys: "mod+0", category: "View" },
  { id: "toggleToolbar", label: "Toggle Toolbar", keys: "mod+shift+t", category: "View" },

  // Tools
  { id: "preTranslate", label: "Pre-Translate", keys: "mod+shift+p", category: "Tools", editorOnly: true },
  { id: "openSettings", label: "Settings", keys: "mod+,", category: "Tools" },
];

export const SHORTCUT_CATEGORIES = ["File", "Edit", "View", "Tools"] as const;
