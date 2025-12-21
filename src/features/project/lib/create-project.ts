import { toast } from "sonner";
import { FileWithPath } from "../types/file.types";
import { ParsedProject } from "../types/project.types";
import { getSourceRootDir } from "@/core/lib/utils";
import {
  extractLanguageCode,
  parseJSONFile,
  flattenJson,
} from "./project-utils";

export async function createProject(
  files: FileWithPath[],
  framework: string,
  primaryLanguage: string
): Promise<ParsedProject | void> {
  try {
    let foundPrimaryLanguage = false;
    const langCodes = files.map(
      (file) => extractLanguageCode(file.name) ?? file.name.split(".")[0]
    );

    let primaryFlat: Record<string, string> = {};

    for (const file of files) {
      if (file.name === `${primaryLanguage}.json`) {
        foundPrimaryLanguage = true;

        const json = await parseJSONFile({
          name: file.name,
          path: file.path,
          content: file.content,
          size: file.size,
        });
        primaryFlat = flattenJson(json);
        break;
      }
    }

    const firstFilePath = files[0].path;
    const source_root_dir = getSourceRootDir(firstFilePath);

    if (!foundPrimaryLanguage) {
      toast.error(
        `Primary language file "${primaryLanguage}.json" is missing.`
      );
      return;
    }

    toast.success("Project created successfully.");
    return {
      version: "1.0.0",
      be_version: "1.0.0",
      framework,
      filename: "project.babler",
      source_root_dir: source_root_dir,
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
                description: "",
                comment: "",
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
        ],
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    toast.error(`Failed to create project: ${message}`);
    return;
  }
}
