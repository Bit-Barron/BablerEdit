import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { createAnimation, getRandomAnimation } from "../ui/theme-animation";
import { SunIcon } from "@/components/icons/sun";
import { MoonIcon } from "@/components/icons/moon";
import { useTheme } from "@/components/providers/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css: string) => {
    if (typeof window === "undefined") return;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const handleThemeChange = useCallback(
    (theme: "light" | "dark" | "system") => {
      const { variant: randomVariant, start: randomStart } =
        getRandomAnimation();
      const animation = createAnimation(randomVariant, randomStart);
      updateStyles(animation.css);

      if (typeof window === "undefined") return;

      const switchTheme = () => {
        setTheme(theme);
      };

      if (!document.startViewTransition) {
        switchTheme();
        return;
      }

      document.startViewTransition(switchTheme);
    },
    [setTheme, updateStyles]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          name="Theme Toggle Button"
          className="h-7 w-7 p-0 flex items-center justify-center"
        >
          <SunIcon
            size={14}
            className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          />
          <MoonIcon
            size={14}
            className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="cursor-pointer"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="cursor-pointer"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="cursor-pointer"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
