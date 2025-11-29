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
    <div className="border-b bg-muted/30">
      <div className="flex items-center justify-center h-[60px] px-2 gap-0.5 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR_BUTTONS.map((button) => {
            const Icon = Icons[
              button.icon as keyof typeof Icons
            ] as React.ComponentType<{ className?: string }>;
            const handleClick = button.onClick
              ? handlers[button.onClick]
              : undefined;

            return (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClick}
                    disabled={button.disabled}
                    className="flex flex-col items-center justify-center gap-1 h-auto min-w-[72px] px-3 py-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] leading-tight text-center">
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
