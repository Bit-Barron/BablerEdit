import { ParsedProject } from "@/features/translation-parser/types/parser.types";
import { BablerProject } from "../types/file-manager.types";

export function generateBablerProject(
  parsedProject: ParsedProject,
  filename: string,
  editTranslations: Map<string, Map<string, string>>
): BablerProject {
  const languages = Array.from(parsedProject.languages.keys()).map((code) => ({
    code,
    name: code.toUpperCase(),
  }));

  return {
    version: "1.0",
    framework: parsedProject.framework,
    filename,
    sourceRootDir: "./",
    primaryLanguage: parsedProject.primaryLanguage,

    languages,

    translationPackages: [
      {
        name: "main",
        translationUrls: languages.map((lang) => ({
          path: `${lang.code}.json`,
          language: lang.code,
        })),
      },
    ],

    editorConfiguration: {
      saveEmptyTranslations: true,
      translationOrder: "alphabetically",
      indent: "tab",
      format: "namespaced-json",
      supportArrays: true,
    },

    metadata: {
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      beVersion: "1.0.0",
    },
  };
}
