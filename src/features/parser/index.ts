import {
  extractLanguageCode,
  parseJSONFile,
  flattenJson,
} from "./lib/json-parser";
import { LanguageData, ParsedProject } from "./types/parser";

export async function createProject(
  files: File[],
  framework: string,
  primaryLanguage: string = "en"
): Promise<ParsedProject> {
  const primaryFile = files.find(
    (file) => extractLanguageCode(file.name) === primaryLanguage
  );

  if (!primaryFile) {
    throw new Error(
      `Primary language file "${primaryLanguage}.json" not found! ` +
        `Please upload a file named "${primaryLanguage}.json"`
    );
  }

  const primaryData = await parseJSONFile(primaryFile);
  const primaryFlattened = flattenJson(primaryData);

  const allKeys = Object.keys(primaryFlattened).sort();

  const languages = new Map<string, LanguageData>();
  languages.set(primaryLanguage, {
    languageCode: primaryLanguage,
    translations: primaryFlattened,
  });

  for (const file of files) {
    const langCode = extractLanguageCode(file.name);

    if (!langCode) {
      console.warn(`Could not extract language code from: ${file.name}`);
      continue;
    }

    if (langCode === primaryLanguage) {
      continue;
    }

    try {
      const data = await parseJSONFile(file);
      const flattened = flattenJson(data);

      languages.set(langCode, {
        languageCode: langCode,
        translations: flattened,
      });
    } catch (error) {
      console.error(`Failed to parse ${file.name}:`, error);
      throw new Error(
        `Failed to parse ${file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  return {
    framework,
    primaryLanguage,
    allKeys,
    languages,
  };
}
