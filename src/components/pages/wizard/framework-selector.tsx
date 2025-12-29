import { FILETYPES, getFrameworkIcon } from "@/lib/config/frameworks.config";
import React from "react";
import { FrameworkType } from "@/lib/types/project.types";
import { useProjectStore } from "@/lib/store/project.store";
import { Card } from "@/components/ui/retroui/card";

interface WizardFrameworkSelectorProps {
  onSelect: () => void;
}

export const WizardFrameworkSelector: React.FC<
  WizardFrameworkSelectorProps
> = ({ onSelect }) => {
  const { setSelectedFramework } = useProjectStore();

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {FILETYPES.map((type) => (
        <Card
          key={type.id}
          className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all group min-h-24"
          onClick={() => {
            setSelectedFramework(type.id as FrameworkType);
            onSelect();
          }}
        >
          <div
            className={`text-3xl mb-2 group-hover:scale-110 transition-transform ${type.color}`}
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
      ))}
    </div>
  );
};
