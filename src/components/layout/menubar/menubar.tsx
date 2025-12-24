import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MENUS } from "@/lib/config/menus.config";

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
                {item.items.map((child, index) => {
                  if (child.divider) {
                    return (
                      <div
                        key={index}
                        className="h-px bg-secondary my-1 mx-2"
                      />
                    );
                  }

                  return (
                    <div key={child.label}>
                      <NavigationMenuLink className="">
                        {child.label}
                      </NavigationMenuLink>
                    </div>
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
