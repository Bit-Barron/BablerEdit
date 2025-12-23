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
import { ToolbarType } from "../types/common.types";

export const TOOLBAR: ToolbarType[] = [
  {
    id: "open",
    icon: FolderOpen,
    label: "Open project",
    onClick: "onOpenProject",
    enabledIn: ["/", "/wizard"],
    disabled: false,
  },
  {
    id: "save",
    icon: Save,
    label: "Save project",
    onClick: "onSaveProject",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "add-id",
    icon: Plus,
    label: "Add ID",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "remove-ids",
    icon: Trash2,
    label: "Remove IDs",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "filter",
    icon: Filter,
    label: "Set Filter",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "pre-translate",
    icon: Languages,
    label: "Pre-Translate",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "consistency",
    icon: Bot,
    label: "ConsistencyAI",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "languages",
    icon: Globe,
    label: "Languages",
    enabledIn: ["/editor"],
    disabled: false,
  },
];
