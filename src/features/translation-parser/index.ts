import { toast } from "sonner";
import { parseJSONFile, flattenJson } from "./lib/parser";
import { ParsedProject } from "./types/parser.types";

export const extractLangCode = (filename: string[]): string[] => {
  return filename.map((file) => {
    const splitFiles = file.split(".");
    return splitFiles[0];
  });
};

export async function createProject(
  files: File[],
  framework: string,
  primaryLanguage: string
): Promise<ParsedProject | void> {
  let foundPrimaryLanguage = false;

  const langCodes = extractLangCode(files.map((file) => file.name));

  let primaryFlat: Record<string, string> = {};

  for (const file of files) {
    if (file.name === `${primaryLanguage}.json`) {
      foundPrimaryLanguage = true;

      const json = await parseJSONFile(file);
      primaryFlat = flattenJson(json);

      toast.success(`Primary language file "${primaryLanguage}.json" found.`);
      break;
    }
  }

  if (!foundPrimaryLanguage) {
    toast.error(`Primary language file "${primaryLanguage}.json" is missing.`);
    return;
  }

  return {
    version: "1.0.0",
    be_version: "1.0.0",
    framework,
    filename: "project.json",
    source_root_dir: "/",
    is_template_project: false,

    languages: langCodes.map((code) => ({ code })),

    translation_packages: [
      {
        name: "main",
        translation_urls: files.map((file, i) => ({
          path: file.name,
          language: langCodes[i],
        })),
      },
    ],

    editor_configuration: {
      save_empty_translations: true,
      translation_order: "alphabetical",
      custom_languages: [],
      id_extractor_ignores: [],
    },

    primary_language: primaryLanguage,

    configuration: [
      {
        indent: "tab",
        format: "json",
        support_arrays: true,
      },
    ],

    preset_collections: [[]],

    folder_structure: {
      name: "",
      children: [
        {
          type: "package",
          name: "main",
          children: await Promise.all(
            Object.keys(primaryFlat).map(async (key) => ({
              type: "folder",
              name: key,
              translations: await Promise.all(
                files.map(async (file) => {
                  const langCode = file.name.split(".")[0];
                  const json = await parseJSONFile(file);
                  const flat = flattenJson(json);
                  return {
                    language: langCode,
                    value: flat[key] || "",
                    approved: false,
                  };
                })
              ),
            }))
          ),
        },
      ] as any,
    },
  };
}
