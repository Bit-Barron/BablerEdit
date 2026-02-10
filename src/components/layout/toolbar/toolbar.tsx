import { TOOLBAR } from "@/lib/config/toolbar.config";
import { useEditorStore } from "@/lib/store/editor.store";
import { useLocation } from "react-router-dom";

import { Tooltip } from "@/components/ui/retroui/tooltip";
import { Button } from "@/components/ui/retroui/button";

export default function Toolbar() {
  const { setOnProjectClick, selectedNode } = useEditorStore();
  const location = useLocation();

  return (
    <div className="border-b border-border-subtle bg-secondary">
      <div className="flex items-center justify-between h-15 px-3 gap-1 overflow-x-auto">
        <Tooltip.Provider>
          {TOOLBAR.map((button) => {
            const isEnabled = button.enabledIn.includes(location.pathname);

            const isDisabled =
              button.id === "remove-ids"
                ? !selectedNode
                : button.disabled;

            const shouldBeDisabled = !isEnabled || isDisabled;

            return (
              <Tooltip key={button.id}>
                <Tooltip.Trigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={shouldBeDisabled}
                      onClick={() => {
                        if (shouldBeDisabled) return;
                        setOnProjectClick(button.id);
                      }}
                      className="flex items-center gap-2 h-9 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  }
                >
                  <button.icon size={15} className="h-4 w-4" />
                  <span className="text-xs whitespace-nowrap">
                    {button.label}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{button.label}</p>
                </Tooltip.Content>
              </Tooltip>
            );
          })}
        </Tooltip.Provider>
      </div>
    </div>
  );
}
