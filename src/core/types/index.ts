type MenuItemBase = {
  label: string;
};

type MenuItemWithShortcut = MenuItemBase & {
  shortcut: string;
};

type MenuItemWithSubmenu = MenuItemBase & {
  hasSubmenu: true;
};

type MenuItemWithCheck = MenuItemBase & {
  checked: boolean;
  shortcut?: string;
};

type MenuDivider = {
  divider: true;
  label?: never;
};

export type MenuItem =
  | MenuItemBase
  | MenuItemWithShortcut
  | MenuItemWithSubmenu
  | MenuItemWithCheck
  | MenuDivider;

export type Menu = {
  label: string;
  items: MenuItem[];
};

export interface ToolbarButton {
  id: string;
  icon: string;
  label: string;
  onClick?: string;
  disabled?: boolean;
}
