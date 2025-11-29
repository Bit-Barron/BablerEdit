import { Card } from "@/core/components/ui/card";
import { FILETYPES, getFrameworkIcon } from "@/core/lib/constants";
import React from "react";
import { useFilesStore } from "@/features/files/store/file-store";

interface WizzardFrameworkTypesProps {}

export const WizzardFrameworkTypes: React.FC<
  WizzardFrameworkTypesProps
> = ({}) => {
  const { setSelectedFramework, setFrameworkDialogOpen } = useFilesStore();

  const handleFrameworkSelect = (typeId: string) => {
    setSelectedFramework(typeId as FrameworkType);

    setFrameworkDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {FILETYPES.map((type) => (
        <Card
          key={type.id}
          className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all group min-h-[85px]"
          onClick={() => handleFrameworkSelect(type.id)}
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
