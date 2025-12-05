import { flattenJson } from "@/features/translation/lib/parser";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const updateProjectFolderStructure = async (
  parsedProject: ParsedProject
): Promise<ParsedProject> => {
  const loadedTranslations = await Promise.all(
    // Load all translation files
    parsedProject.translation_packages[0].translation_urls.map(
      // Map through each translation file
      async (trans) => {
        const fullPath = `${parsedProject.source_root_dir}${trans.path}`; // Build the full path to the translation file
        const jsonContent = await readTextFile(fullPath); // Read the content of the translation file
        return {
          // Return an object with language and flattened data
          language: trans.language,
          data: flattenJson(JSON.parse(jsonContent)),
        };
      }
    )
  );

  const allKeys = Object.keys(loadedTranslations[0].data); // Get all keys from the first language's data

  console.log("Updated Folder Structure with keys:", allKeys);

  const updatedProject: ParsedProject = {
    ...parsedProject,
    folder_structure: {
      ...parsedProject.folder_structure,
      children: [
        {
          ...parsedProject.folder_structure.children[0],
          children: allKeys.map((key) => ({
            type: "folder" as const,
            name: key,
            description: "",
            comment: "",
            translations: loadedTranslations.map((lt) => ({
              language: lt.language,
              value: lt.data[key] || "",
              approved: false,
            })),
          })),
        },
      ],
    },
  };
  return updatedProject;
};
