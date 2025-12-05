import { flattenJson } from "@/features/translation/lib/parser";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const updateProjectFolderStructure = async (
  parsedProject: ParsedProject
): Promise<ParsedProject> => {
  const loadedTranslations = await Promise.all(
    parsedProject.translation_packages[0].translation_urls.map(
      async (trans) => {
        const fullPath = `${parsedProject.source_root_dir}${trans.path}`;
        const jsonContent = await readTextFile(fullPath);
        return {
          language: trans.language,
          data: flattenJson(JSON.parse(jsonContent)),
        };
      }
    )
  );

  const allKeys = Object.keys(loadedTranslations[0].data);

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
