import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TOOLBAR } from "@/core/config/constants";
import { Button } from "../ui/button";

type ToolbarActions = {
  onOpenProject?: () => void;
  onSaveProject?: () => void;
};

type ToolbarProps = {
  actions: ToolbarActions;
};

export default function Toolbar({ actions }: ToolbarProps) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center h-15 px-3 gap-1 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR.map((button) => {
            const handler =
              button.onClick &&
              typeof actions[button.onClick as keyof ToolbarActions] ===
                "function"
                ? actions[button.onClick as keyof ToolbarActions]
                : undefined;

            return (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handler}
                    variant="ghost"
                    size="sm"
                    disabled={button.disabled || !handler}
                    className="flex items-center gap-2 h-9 px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <button.icon className="h-4 w-4" />
                    <span className="text-xs whitespace-nowrap">
                      {button.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
