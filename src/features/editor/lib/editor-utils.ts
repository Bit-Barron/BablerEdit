import { ParsedProject } from "@/features/project/types/project.types";
import { flattenJson } from "@/features/project/lib/project-utils";
import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";
import { TreeNodeType } from "../types/tree.types";

export const buildTranslationTree = (
  projectData: ParsedProject
): TreeNodeType[] => {
  const allKeys: string[] = [];

  for (let i of projectData.folder_structure.children[0].children) {
    allKeys.push(i.name);
  }
  const tree: Record<string, any> = {};
  allKeys.forEach((key) => {
    const parts = key.split(".");
    let current = tree;

    parts.forEach((part, idx) => {
      if (!current[part]) {
        current[part] = idx === parts.length - 1 ? null : {};
      }
      current = current[part];
    });
  });

  const convert = (
    obj: Record<string, any>,
    parentPath: string = ""
  ): TreeNodeType[] => {
    return Object.entries(obj).map(([name, child]) => {
      const fullPath = parentPath ? `${parentPath}.${name}` : name;

      if (!child) return { id: fullPath, name };

      return {
        id: fullPath,
        name,
        children: convert(child, fullPath),
      };
    });
  };

  return convert(tree);
};

export const serializeProject = (project: ParsedProject): ParsedProject => {
  return {
    version: "1.0.0",
    be_version: "1.0.0",
    framework: project.framework,
    filename: project.filename,
    source_root_dir: project.source_root_dir,
    is_template_project: project.is_template_project,
    languages: project.languages,
    translation_packages: project.translation_packages,
    editor_configuration: project.editor_configuration,
    primary_language: project.primary_language,
    configuration: project.configuration,
    preset_collections: project.preset_collections,
    folder_structure: {
      ...project.folder_structure,
      children: project.folder_structure.children.map((pkg) => ({
        ...pkg,
        children: pkg.children.map((concept) => ({
          ...concept,
          translations: concept.translations.map((t) => ({
            language: t.language,
            value: t.value,
            approved: t.approved,
          })),
        })),
      })),
    },
  };
};

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
