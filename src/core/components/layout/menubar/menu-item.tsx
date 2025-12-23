import { MenuItem as MenuItemType } from "@/core/types/common.types";

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <button className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-accent transition-colors text-left">
      <span className="flex items-center gap-2">{item.label}</span>
    </button>
  );
}
