import React from "react";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Checkbox } from "@/core/components/ui/checkbox";

interface TranslationDetailProps {
  selectedNode: any;
  project: any;
}

export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  if (!selectedNode || !selectedNode.isLeaf) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a translation key
      </div>
    );
  }

  const translationKey = selectedNode.data.id;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
        <h2 className="font-semibold text-sm">{translationKey}</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {(Array.from(project.languages.entries()) as [string, any][]).map(
            ([langCode, langData]) => {
              const value = langData.translations[translationKey] || "";

              return (
                <div key={langCode} className="p-4 flex items-center gap-4">
                  <div className="w-16 text-sm font-medium uppercase">
                    {langCode}
                  </div>

                  <div className="flex-1">
                    <Input
                      value={value}
                      onChange={(e) => {
                        console.log(
                          "Update:",
                          translationKey,
                          langCode,
                          e.target.value
                        );
                      }}
                      className="font-sans"
                      placeholder={
                        langCode === project.primaryLanguage
                          ? "Enter translation..."
                          : ""
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id={`approved-${langCode}`} />
                    <Label
                      htmlFor={`approved-${langCode}`}
                      className="text-xs text-muted-foreground"
                    >
                      Approved
                    </Label>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
