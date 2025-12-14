import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { MENUS } from "@/core/config/constants";
import { cn } from "@/core/lib/utils";

export default function MenuBar() {
  return (
    <div className="w-full bg-secondary border-b border-border-subtle">
      <NavigationMenu viewport={false} className="max-w-none justify-start">
        <NavigationMenuList className="gap-0">
          {MENUS.map((menu) => (
            <NavigationMenuItem key={menu.label}>
              <NavigationMenuTrigger className="h-7 px-3 text-[13px] font-normal text-white/90 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 rounded-none">
                {menu.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="min-w-50 bg-[#3c3c3c] border border-border-subtle rounded-md overflow-hidden p-1">
                  {menu.items.map((item, idx) => {
                    if (item.divider) {
                      return (
                        <li
                          key={`divider-${idx}`}
                          className="h-px bg-secondary my-1 mx-2"
                        />
                      );
                    }

                    return (
                      <li key={item.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            to="#"
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 text-[13px] text-white/90",
                              "hover:bg-blue-600 hover:text-white rounded-sm cursor-pointer transition-colors",
                              item.checked && "pl-6 relative"
                            )}
                          >
                            {item.checked && (
                              <span className="absolute left-2 text-white">
                                ✓
                              </span>
                            )}
                            <span className="flex-1">{item.label}</span>
                            {item.shortcut && (
                              <span className="text-white/60 text-xs ml-8">
                                {item.shortcut}
                              </span>
                            )}
                            {item.hasSubmenu && (
                              <span className="text-white/60 ml-2">▶</span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
