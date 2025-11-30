import { ParsedProject } from "@/features/translation-parser/types/parser.types";

export function generateTranslationFiles(
  parsedProject: ParsedProject,
  editTranslations: Map<string, Map<string, string>>
): Map<string, string> {
  const files = new Map<string, string>();

  console.log("Generating translation files with edits:", editTranslations);
  console.log("Parsed project data:", parsedProject);

  parsedProject.languages.forEach((langData, langCode) => {
    const mergedTranslations: Record<string, string> = {};

    parsedProject.allKeys.forEach((key) => {
      const editedValue = editTranslations.get(key)?.get(langCode);
      const originalValue = langData.translations[key];

      mergedTranslations[key] = editedValue ?? originalValue ?? "";
    });

    const nestedJson = unflattenJson(mergedTranslations);

    const filename = `${langCode}.json`;
    const content = JSON.stringify(nestedJson, null, 2);

    files.set(filename, content);
  });

  return files;
}

function unflattenJson(flat: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(flat).forEach((key) => {
    const parts = key.split(".");
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = flat[key];
  });

  return result;
}
