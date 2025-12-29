import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import StatusIndicator from "@/components/elements/status-indicator";
import { MENUS } from "@/lib/config/menus.config";
import { useProjectStore } from "@/lib/store/project.store";
import { ModeToggle } from "@/components/elements/toggles/mode-toggle";

export default function MenuBar() {
  const { hasUnsavedChanges } = useProjectStore();

  return (
    <div className="w-full bg-secondary border-b border-border-subtle flex items-center justify-between">
      <NavigationMenu className="relative z-50">
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
      <div className="pr-4 flex space-x-2">
        {hasUnsavedChanges && (
          <StatusIndicator state="down" label="Has unsaved changes" />
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
