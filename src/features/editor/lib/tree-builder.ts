import { LanguageData } from "@/features/translation-parser/types/parser.types";
import { TreeNode } from "../types/editor.types";

export const buildTranslationTree = (
  languageData: LanguageData | undefined
): TreeNode[] => {
  if (!languageData) return [];

  const translations = languageData.translations;

  const allKeys = Object.keys(translations).sort();

  const buildNode = (keys: string[], depth: number = 0): TreeNode[] => {
    const grouped = new Map<string, string[]>();

    keys.forEach((key) => {
      const parts = key.split(".");
      const currentPart = parts[depth];

      if (!grouped.has(currentPart)) {
        grouped.set(currentPart, []);
      }
      grouped.get(currentPart)!.push(key);
    });

    return Array.from(grouped.entries()).map(([part, partKeys]) => {
      const hasDeeper = partKeys.some((k) => k.split(".").length > depth + 1);

      if (!hasDeeper) {
        return {
          id: partKeys[0],
          name: part,
        };
      }

      return {
        id: partKeys[0]
          .split(".")
          .slice(0, depth + 1)
          .join("."),
        name: part,
        children: buildNode(partKeys, depth + 1),
      };
    });
  };

  return buildNode(allKeys);
};
