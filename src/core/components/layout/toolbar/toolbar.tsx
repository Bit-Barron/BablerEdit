import { TOOLBAR } from "@/core/config/toolbar.config";
import { useToolbarStore } from "@/core/store/toolbar.store";
import { useLocation } from "react-router-dom";

import { Button } from "@/core/components/icons/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { useSelectionStore } from "@/features/editor/stores/selection.store";

export default function Toolbar() {
  const { setOnProjectClick } = useToolbarStore();
  const { selectedNode } = useSelectionStore();
  const location = useLocation();

  return (
    <div className="border-b border-border-subtle bg-secondary">
      <div className="flex items-center justify-between h-15 px-3 gap-1 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR.map((button) => {
            const isEnabled = button.enabledIn.includes(location.pathname);

            const isDisabled =
              button.id === "remove-ids" ? !selectedNode : button.disabled;

            const shouldBeDisabled = !isEnabled || isDisabled;

            return (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (shouldBeDisabled) return;
                      setOnProjectClick(button.id);
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={shouldBeDisabled}
                    className="flex items-center gap-2 h-9 px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
