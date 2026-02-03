import { Menu } from "@/lib/types/config.types";

export const MENUS: Menu[] = [
  {
    label: "File",
    items: [
      { label: "New Project...", shortcut: "⌘N", action: "newProject" },
      { label: "Open Project...", shortcut: "⌘O", action: "openProject" },
      { label: "Open Recent", hasSubmenu: true, action: "openRecent" },
      { divider: true },
      { label: "Close Project", shortcut: "⌘W", action: "closeProject" },
      { label: "Save Project", shortcut: "⌘S", action: "saveProject" },
      { label: "Save Project As...", shortcut: "⇧⌘S", action: "saveProjectAs" },
      { divider: true },
      { label: "Import...", action: "import" },
      { label: "Export...", action: "export" },
      { divider: true },
      { label: "Quit", shortcut: "⌘Q", action: "quit" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "⌘Z", action: "undo" },
      { label: "Redo", shortcut: "⇧⌘Z", action: "redo" },
      { divider: true },
      { label: "Cut", shortcut: "⌘X", action: "cut" },
      { label: "Copy", shortcut: "⌘C", action: "copy" },
      { label: "Paste", shortcut: "⌘V", action: "paste" },
      { divider: true },
      { label: "Find...", shortcut: "⌘F", action: "find" },
      { label: "Replace...", shortcut: "⌘R", action: "replace" },
    ],
  },
  {
    label: "Find",
    items: [
      { label: "Find Translation...", shortcut: "⌘F", action: "findTranslation" },
      { label: "Find Next", shortcut: "⌘G", action: "findNext" },
      { label: "Find Previous", shortcut: "⇧⌘G", action: "findPrevious" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Show Toolbar", checked: true, action: "toggleToolbar" },
      { label: "Show Status Bar", checked: true, action: "toggleStatusBar" },
      { divider: true },
      { label: "Zoom In", shortcut: "⌘+", action: "zoomIn" },
      { label: "Zoom Out", shortcut: "⌘-", action: "zoomOut" },
      { label: "Actual Size", shortcut: "⌘0", action: "zoomReset" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Pre-Translate...", action: "preTranslate" },
      { label: "Machine Translation...", action: "machineTranslation" },
      { label: "Consistency Check...", action: "consistencyCheck" },
      { divider: true },
      { label: "Validate Translations", action: "validateTranslations" },
      { label: "Statistics...", action: "statistics" },
    ],
  },
  {
    label: "Window",
    items: [
      { label: "Minimize", shortcut: "⌘M", action: "minimize" },
      { label: "Zoom", action: "zoomWindow" },
      { divider: true },
      { label: "Bring All to Front", action: "bringAllToFront" },
    ],
  },
];
