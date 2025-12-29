import { Menu } from "@/lib/types/config.types";

export const MENUS: Menu[] = [
  {
    label: "File",
    items: [
      { label: "New Project...", shortcut: "⌘N" },
      { label: "Open Project...", shortcut: "⌘O" },
      { label: "Open Recent", hasSubmenu: true },
      { divider: true },
      { label: "Close Project", shortcut: "⌘W" },
      { label: "Save Project", shortcut: "⌘S" },
      { label: "Save Project As...", shortcut: "⇧⌘S" },
      { divider: true },
      { label: "Import..." },
      { label: "Export..." },
      { divider: true },
      { label: "Quit", shortcut: "⌘Q" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "⌘Z" },
      { label: "Redo", shortcut: "⇧⌘Z" },
      { divider: true },
      { label: "Cut", shortcut: "⌘X" },
      { label: "Copy", shortcut: "⌘C" },
      { label: "Paste", shortcut: "⌘V" },
      { divider: true },
      { label: "Find...", shortcut: "⌘F" },
      { label: "Replace...", shortcut: "⌘R" },
    ],
  },
  {
    label: "Find",
    items: [
      { label: "Find Translation...", shortcut: "⌘F" },
      { label: "Find Next", shortcut: "⌘G" },
      { label: "Find Previous", shortcut: "⇧⌘G" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Show Toolbar", checked: true },
      { label: "Show Status Bar", checked: true },
      { divider: true },
      { label: "Zoom In", shortcut: "⌘+" },
      { label: "Zoom Out", shortcut: "⌘-" },
      { label: "Actual Size", shortcut: "⌘0" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Pre-Translate..." },
      { label: "Machine Translation..." },
      { label: "Consistency Check..." },
      { divider: true },
      { label: "Validate Translations" },
      { label: "Statistics..." },
    ],
  },
  {
    label: "Window",
    items: [
      { label: "Minimize", shortcut: "⌘M" },
      { label: "Zoom" },
      { divider: true },
      { label: "Bring All to Front" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Babel Edit Help" },
      { label: "Check for Updates..." },
      { divider: true },
      { label: "About Babel Edit" },
    ],
  },
];
