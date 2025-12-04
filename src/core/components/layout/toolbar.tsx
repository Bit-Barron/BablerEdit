// src/core/components/layout/toolbar.tsx
import { TOOLBAR } from "@/core/config/constants";
import { useToolbarStore } from "@/core/store/toolbar-store";
import { useLocation } from "react-router-dom";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Toolbar() {
  const { setOnProjectClick } = useToolbarStore();
  const location = useLocation();

  return (
    <div className="border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-center h-15 px-3 gap-1 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR.map((button) => {
            const isEnabled = button.enabledIn.includes(location.pathname);

            return (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setOnProjectClick!(button.id)}
                    variant="ghost"
                    size="sm"
                    disabled={!isEnabled}
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
