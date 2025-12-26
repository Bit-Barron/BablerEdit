import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Translation } from "@/lib/types/project.types";

interface TranslationInputProps {
  translation: Translation;
  toggleApproved: (language: string) => void;
  changeTranslationValue: (value: string, language: string) => void;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({
  translation,
  toggleApproved,
  changeTranslationValue,
}) => {
  const [localValue, setLocalValue] = useState(translation.value);

  useEffect(() => {
    setLocalValue(translation.value);
  }, [translation.value]);

  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-base tracking-wide uppercase text-foreground bg-primary/10 px-4 py-1.5 rounded-md border border-primary/20">
          {translation.language}
        </span>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <Checkbox
            checked={translation.approved}
            onCheckedChange={() => toggleApproved(translation.language)}
            className="w-4 h-4"
          />
          <span>Approved</span>
        </label>
      </div>

      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => changeTranslationValue(localValue, translation.language)}
        className="w-full text-base px-4 py-3 bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md transition-all"
        placeholder={`Enter ${translation.language} translation...`}
      />
    </div>
  );
};
