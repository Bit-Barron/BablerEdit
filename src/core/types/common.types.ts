import { LucideIcon } from "lucide-react";

export interface MenuItem {
  label?: string;
  shortcut?: string;
  hasSubmenu?: boolean;
  checked?: boolean;
  divider?: boolean;
}

export interface Menu {
  label: string;
  items: MenuItem[];
}

export interface ToolbarType {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick?: string;
  disabled: boolean;
  enabledIn: string[];
}

export interface FileType {
  id: string;
  name: string;
  subtitle: string;
  color: string;
}
