import {
  FolderOpen,
  Save,
  Plus,
  Trash2,
  Filter,
  Languages,
  Bot,
  Globe,
} from "lucide-react";
import { FileType, Menu, ToolbarType } from "../types/common.types";

const FRAMEWORK_ICONS: Record<string, string> = {
  angular: "🅰️",
  vue: "🇻",
  i18next: "🌐",
  react: "⚛️",
  flutter: "🦋",
  laravel: "🔧",
  ember: "🔥",
  ruby: "💎",
  svelte: "🔶",
  java: "☕",
  resx: ".NET",
  json: "{ }",
  yaml: "≡",
};

export function getFrameworkIcon(id: string): string {
  return FRAMEWORK_ICONS[id] || "📄";
}

export const FILETYPES: FileType[] = [
  { id: "json", name: "Generic", subtitle: "JSON", color: "text-gray-600" },
  { id: "yaml", name: "Generic", subtitle: "YAML", color: "text-gray-600" },
  { id: "i18next", name: "i18next", subtitle: "", color: "text-blue-600" },
  { id: "react", name: "React", subtitle: "", color: "text-cyan-600" },
  { id: "flutter", name: "Flutter", subtitle: "ARB", color: "text-blue-400" },
  { id: "laravel", name: "Laravel", subtitle: "...", color: "text-red-500" },
  { id: "ember", name: "Ember", subtitle: "...", color: "text-orange-600" },
  {
    id: "ruby",
    name: "Ruby on Rails",
    subtitle: "YAML",
    color: "text-red-700",
  },
];

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

export const TOOLBAR: ToolbarType[] = [
  {
    id: "open",
    icon: FolderOpen,
    label: "Open project",
    onClick: "onOpenProject",
    allowedIn: "wizard",
  },
  {
    id: "save",
    icon: Save,
    label: "Save project",
    onClick: "onSaveProject",
    allowedIn: "editor",
  },
  {
    id: "add-id",
    icon: Plus,
    label: "Add ID",
    allowedIn: "editor",
  },
  {
    id: "remove-ids",
    icon: Trash2,
    label: "Remove IDs",
    allowedIn: "editor",
  },
  {
    id: "filter",
    icon: Filter,
    label: "Set Filter",
    allowedIn: "editor",
  },
  {
    id: "pre-translate",
    icon: Languages,
    label: "Pre-Translate",
    allowedIn: "editor",
  },
  {
    id: "consistency",
    icon: Bot,
    label: "ConsistencyAI",
    allowedIn: "editor",
  },
  {
    id: "languages",
    icon: Globe,
    label: "Languages",
    allowedIn: "editor",
  },
];

export const SETTINGS_FILE = "settings.json";
