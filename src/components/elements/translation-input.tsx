import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/retroui/input";
import { Translation } from "@/lib/types/project.types";
import { CheckboxComponent } from "@/components/ui/retroui/checkbox";
import { Button } from "@/components/ui/retroui/button";
import { SparklesIcon, AlertTriangleIcon } from "lucide-react";
import { translateText } from "@/lib/helpers/translate-text";
import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { detectPlaceholders } from "@/lib/helpers/placeholder-validator";

interface TranslationInputProps {
  translation: Translation;
  toggleApproved: (language: string) => void;
  changeTranslationValue: (value: string, language: string) => void;
  primaryTranslation?: Translation | null;
  framework?: string;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({
  translation,
  toggleApproved,
  changeTranslationValue,
  primaryTranslation,
  framework,
}) => {
  const [inputValue, setInputValue] = useState(translation.value);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { primaryLanguageCode } = useProjectStore();
  const { selectedModel } = useEditorStore();

  useEffect(() => {
    setInputValue(translation.value);
    setSuggestion("");
  }, [translation.value]);

  const handleSuggest = async () => {
    if (!primaryTranslation?.value || loading) return;
    setLoading(true);
    try {
      const model = selectedModel || "mistral:mistral";
      const result = await translateText(
        primaryTranslation.value,
        primaryLanguageCode,
        translation.language,
        model
      );
      setSuggestion(result);
    } catch {
      setSuggestion("");
    } finally {
      setLoading(false);
    }
  };

  const acceptSuggestion = () => {
    if (!suggestion) return;
    setInputValue(suggestion);
    changeTranslationValue(suggestion, translation.language);
    setSuggestion("");
  };

  // Placeholder validation
  const placeholderWarning = React.useMemo(() => {
    if (!primaryTranslation?.value || !inputValue) return null;
    const primaryPlaceholders = detectPlaceholders(primaryTranslation.value, framework);
    if (primaryPlaceholders.length === 0) return null;
    const currentPlaceholders = detectPlaceholders(inputValue, framework);
    const missing = primaryPlaceholders.filter((p) => !currentPlaceholders.includes(p));
    if (missing.length === 0) return null;
    return `Missing placeholders: ${missing.join(", ")}`;
  }, [primaryTranslation?.value, inputValue, framework]);

  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-base tracking-wide uppercase text-foreground bg-primary/10 px-4 py-1.5 rounded-md border border-primary/20">
          {translation.language}
        </span>
        <div className="flex items-center gap-3">
          {primaryTranslation && translation.language !== primaryLanguageCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSuggest}
              disabled={loading || !primaryTranslation.value}
              className="text-xs h-7 px-2"
            >
              <SparklesIcon size={14} className="mr-1" />
              {loading ? "..." : "Suggest"}
            </Button>
          )}
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <CheckboxComponent
              checked={translation.approved}
              onCheckedChange={() => toggleApproved(translation.language)}
              className="w-4 h-4"
            />
            <span>Approved</span>
          </label>
        </div>
      </div>

      {suggestion && (
        <div className="mb-2 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
          <span className="text-sm flex-1 text-blue-700 dark:text-blue-300">{suggestion}</span>
          <Button size="sm" className="h-6 text-xs px-2" onClick={acceptSuggestion}>
            Accept
          </Button>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setSuggestion("")}>
            Dismiss
          </Button>
        </div>
      )}

      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          if (inputValue !== translation.value) {
            changeTranslationValue(inputValue, translation.language);
          }
        }}
        className="w-full text-base px-4 py-3 bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md transition-all"
        placeholder={`Enter ${translation.language} translation...`}
      />

      {placeholderWarning && (
        <div className="mt-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <AlertTriangleIcon size={14} />
          <span className="text-xs">{placeholderWarning}</span>
        </div>
      )}
    </div>
  );
};
