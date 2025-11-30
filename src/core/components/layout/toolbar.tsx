import * as Icons from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TOOLBAR_BUTTONS } from "@/core/lib/constants";
import { Button } from "../ui/button";

interface ToolbarProps {
  onOpenProject?: () => void;
  onSaveProject?: () => void;
}

export default function Toolbar({
  onOpenProject,
  onSaveProject,
}: ToolbarProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    onOpenProject,
    onSaveProject,
  };

  return (
    <div className="border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center h-15 px-3 gap-1 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR_BUTTONS.map((button) => {
            const Icon = Icons[
              button.icon as keyof typeof Icons
            ] as React.ComponentType<{ className?: string }>;
            const handleClick = button.onClick
              ? handlers[button.onClick]
              : undefined;

            return (
              <>
                <Tooltip key={button.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClick}
                      disabled={button.disabled}
                      className="flex items-center gap-2 h-9 px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs whitespace-nowrap">
                        {button.label}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{button.label}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
