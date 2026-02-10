import { FILETYPES, getFrameworkIcon } from "@/lib/config/frameworks.config";
import React from "react";
import { FrameworkType } from "@/lib/types/project.types";
import { useProjectStore } from "@/lib/store/project.store";
import { Card } from "@/components/ui/retroui/card";

interface WizardFrameworkSelectorProps {
  onSelect: () => void;
}

const JSON_FRAMEWORKS = new Set(["json", "i18next", "react", "vue"]);

export const WizardFrameworkSelector: React.FC<
  WizardFrameworkSelectorProps
> = ({ onSelect }) => {
  const { setSelectedFramework } = useProjectStore();

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {FILETYPES.map((type) => {
        const supported = JSON_FRAMEWORKS.has(type.id);

        return (
          <Card
            key={type.id}
            className={`relative flex flex-col items-center justify-center p-4 transition-all group min-h-24 ${
              supported
                ? "cursor-pointer hover:bg-accent hover:border-primary/50"
                : "opacity-45 cursor-not-allowed"
            }`}
            onClick={() => {
              if (!supported) return;
              setSelectedFramework(type.id as FrameworkType);
              onSelect();
            }}
          >
            {!supported && (
              <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                Soon
              </span>
            )}
            <div
              className={`text-3xl mb-2 transition-transform ${type.color} ${supported ? "group-hover:scale-110" : ""}`}
            >
              {getFrameworkIcon(type.id)}
            </div>
            <div className="text-center">
              <div className="font-medium text-xs mb-0.5">{type.name}</div>
              {type.subtitle && (
                <div className="text-[10px] text-muted-foreground">
                  {type.subtitle}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
