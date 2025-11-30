export interface TranslationEntry {
  key: string;
  value: string;
  path: string[];
}

export interface LanguageData {
  languageCode: string;
  translations: Record<string, string>;
}

export interface ParsedProject {
  framework: string;
  primaryLanguage: string;
  allKeys: string[];
  languages: Map<string, LanguageData>;
}
