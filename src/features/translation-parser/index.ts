import { extractLanguageCode } from "./lib/lang-detector";
import { parseJSONFile, flattenJson } from "./lib/parser";
import { LanguageData, ParsedProject } from "./types/parser.types";

async function parseLanguageFile(file: File): Promise<LanguageData> {
  const langCode = extractLanguageCode(file.name);

  if (!langCode) {
    throw new Error(`Could not extract language code from: ${file.name}`);
  }

  try {
    const data = await parseJSONFile(file);
    const translations = flattenJson(data);

    return {
      languageCode: langCode,
      translations,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse ${file.name}: ${message}`);
  }
}

function findPrimaryFile(files: File[], primaryLanguage: string): File {
  const primaryFile = files.find(
    (file) => extractLanguageCode(file.name) === primaryLanguage
  );

  if (!primaryFile) {
    throw new Error(
      `Primary language file not found! Please upload a "${primaryLanguage}.json" file.`
    );
  }

  return primaryFile;
}

export async function createProject(
  files: File[],
  framework: string,
  primaryLanguage: string = "en"
): Promise<ParsedProject> {
  const primaryFile = findPrimaryFile(files, primaryLanguage);
  const primaryData = await parseLanguageFile(primaryFile);

  const allKeys = Object.keys(primaryData.translations).sort();
  const languages = new Map<string, LanguageData>([
    [primaryLanguage, primaryData],
  ]);

  const otherFiles = files.filter((file) => file !== primaryFile);

  for (const file of otherFiles) {
    try {
      const languageData = await parseLanguageFile(file);
      languages.set(languageData.languageCode, languageData);
    } catch (error) {
      console.warn(error);
    }
  }

  return {
    framework,
    primaryLanguage,
    allKeys,
    languages,
  };
}
