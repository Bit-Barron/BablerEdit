import { X, Minus, Square } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "../ui/button";

export default function WindowControls() {
  const appWindow = getCurrentWindow();

  return (
    <div className="flex items-center gap-1 ml-auto">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => appWindow.minimize()}
        className="h-6 w-8 rounded-none hover:bg-accent"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => appWindow.toggleMaximize()}
        className="h-6 w-8 rounded-none hover:bg-accent"
      >
        <Square className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => appWindow.close()}
        className="h-6 w-8 rounded-none hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
