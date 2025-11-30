import { MENUS } from "@/core/lib/constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import MenuItem from "../elements/menu-item";
import { MenuItem as MenuItemType } from "@/core/types/common.types";

export default function MenuBar() {
  return (
    <div className="bg-background border-b">
      <NavigationMenu className="h-6">
        <NavigationMenuList className="space-x-0">
          {MENUS.map((menu) => (
            <NavigationMenuItem key={menu.label}>
              <NavigationMenuTrigger className="h-6 px-2 py-0.5 text-[13px] font-normal hover:bg-accent data-[state=open]:bg-accent rounded-sm">
                {menu.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="min-w-[220px] bg-popover rounded-md shadow-lg py-1">
                  {menu.items.map((item: MenuItemType, index: number) => (
                    <MenuItem item={item} index={index} />
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
