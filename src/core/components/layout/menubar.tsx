import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { MENUS } from "@/core/config/constants";

export default function MenuBar() {
  return (
    <div className="w-full bg-secondary border-b border-border-subtle">
      <NavigationMenu viewport={false} className="relative z-50">
        <NavigationMenuList>
          {MENUS.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger className="bg-secondary">
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-popover border border-border rounded-md shadow-lg p-4 min-w-50">
                {item.items.map((child) => {
                  if (child.divider) {
                    return (
                      <li
                        key={`divider-${child.label}`}
                        className="h-px bg-secondary my-1 mx-2"
                      />
                    );
                  }

                  return (
                    <li key={child.label}>
                      <NavigationMenuLink className="">
                        {child.label}
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
