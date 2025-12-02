import { Card } from "@/core/components/ui/card";
import { FILETYPES, getFrameworkIcon } from "@/core/config/constants";
import React from "react";
import { FrameworkType } from "@/core/types/framework.types";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";

export const WizardFrameworkSelector: React.FC = () => {
  const { setSelectedFramework, setFileUploadDialogOpen } =
    useFileManagerStore();

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {FILETYPES.map((type) => (
        <Card
          key={type.id}
          className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all group min-h-[85px]"
          onClick={() => {
            setSelectedFramework(type.id as FrameworkType);
            setFileUploadDialogOpen(true);
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
