import { MenuItem as MenuItemType } from "@/core/types";

interface MenuItemProps {
  item: MenuItemType;
  index: number;
}

export default function MenuItem({ item, index }: MenuItemProps) {
  if ("divider" in item && item.divider) {
    return <div key={`divider-${index}`} className="my-1 h-px bg-border" />;
  }

  const hasCheck = "checked" in item && item.checked;
  const hasSubmenu = "hasSubmenu" in item && item.hasSubmenu;
  const hasShortcut = "shortcut" in item && item.shortcut;

  return (
    <button
      key={item.label}
      className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-accent transition-colors text-left"
    >
      <span className="flex items-center gap-2">
        {hasCheck && <span className="text-xs">✓</span>}
        {item.label}
        {hasSubmenu && <span className="ml-auto text-xs">▶</span>}
      </span>
      {hasShortcut && (
        <span className="text-muted-foreground text-xs ml-8">
          {"shortcut" in item ? item.shortcut : ""}
        </span>
      )}
    </button>
  );
}
