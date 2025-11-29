export interface TranslationEntry {
  key: string; // z.B. "AUFTRAG.ADD_TERMIN"
  value: string; // z.B. "Termin hinzufügen"
  path: string[]; // z.B. ["AUFTRAG", "ADD_TERMIN"]
}

export interface LanguageData {
  languageCode: string; // z.B. "de"
  translations: Record<string, string>; // key → value Map
}

export interface ParsedProject {
  framework: string; // z.B. "json"
  primaryLanguage: string; // z.B. "en"
  allKeys: string[]; // Alle Keys aus Primary Language
  languages: Map<string, LanguageData>; // languageCode → LanguageData
}
