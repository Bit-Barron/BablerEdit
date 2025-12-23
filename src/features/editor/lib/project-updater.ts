import { ParsedProject } from "@/features/project/types/project.types";
import { flattenJson } from "@/features/project/utils/flatten-json";
import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";

export const updateProjectFolderStructure = async (
  parsedProject: ParsedProject
): Promise<ParsedProject | null> => {
  const loadedTranslations = await Promise.all(
    parsedProject.translation_packages[0].translation_urls.map(
      async (trans) => {
        const fullPath = `${parsedProject.source_root_dir}${trans.path}`;
        const jsonContent = await readTextFile(fullPath);
        return {
          language: trans.language,
          data: flattenJson(parseJson(jsonContent) as Record<string, string>),
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
