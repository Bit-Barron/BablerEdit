import { Menu } from "@/lib/types/config.types";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const mod = isMac ? "⌘" : "Ctrl+";

export const MENUS: Menu[] = [
  {
    label: "File",
    items: [
      { label: "New Project...", shortcut: `${mod}N`, action: "newProject" },
      { label: "Open Project...", shortcut: `${mod}O`, action: "openProject" },
      { divider: true },
      { label: "Close Project", shortcut: `${mod}W`, action: "closeProject" },
      { label: "Save Project", shortcut: `${mod}S`, action: "saveProject" },
      { divider: true },
      { label: "Export to CSV...", action: "exportCsv" },
      { label: "Import from CSV...", action: "importCsv" },
      { divider: true },
      { label: "Quit", shortcut: `${mod}Q`, action: "quit" },
    ],
  },
  {
    label: "Find",
    items: [
      { label: "Find Translation...", shortcut: `${mod}F`, action: "findTranslation" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Show Toolbar", shortcut: `${mod}${isMac ? "" : "Shift+"}${isMac ? "⇧T" : "T"}`, checked: true, action: "toggleToolbar" },
      { divider: true },
      { label: "Zoom In", shortcut: `${mod}+`, action: "zoomIn" },
      { label: "Zoom Out", shortcut: `${mod}-`, action: "zoomOut" },
      { label: "Actual Size", shortcut: `${mod}0`, action: "zoomReset" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Pre-Translate...", shortcut: `${mod}${isMac ? "" : "Shift+"}${isMac ? "⇧P" : "P"}`, action: "preTranslate" },
      { label: "Machine Translation...", action: "machineTranslation" },
      { label: "Consistency Check...", action: "consistencyCheck" },
      { divider: true },
      { label: "Validate Translations", action: "validateTranslations" },
      { label: "Statistics...", action: "statistics" },
      { divider: true },
      { label: "API Keys...", action: "apiKeys" },
      { divider: true },
      { label: "Settings...", shortcut: `${mod},`, action: "openSettings" },
    ],
  },
  {
    label: "Window",
    items: [
      { label: "Minimize", shortcut: `${mod}M`, action: "minimize" },
      { label: "Zoom", action: "zoomWindow" },
    ],
  },
];
