import React from "react";

interface LanguageListProps {}

export const LanguageList: React.FC<LanguageListProps> = ({}) => {
  return (
    <div className="mt-4 min-h-[200px] border rounded-md p-4 bg-background">
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground/60">
          No languages added yet
        </p>
      </div>
    </div>
  );
};
