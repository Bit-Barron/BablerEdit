import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TOOLBAR_BUTTONS } from "@/core/lib/constants";
import { Button } from "../ui/button";
import { useSaveProject } from "@/features/file-manager/hooks";

export default function Toolbar() {
  const { saveProject } = useSaveProject();

  const handleButtonClick = (buttonId: string) => {
    try {
      console.log(buttonId);
      saveProject();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center h-15 px-3 gap-1 overflow-x-auto">
        <TooltipProvider>
          {TOOLBAR_BUTTONS.map((button) => {
            return (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={button.disabled}
                    onClick={() => handleButtonClick(button.id)}
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
