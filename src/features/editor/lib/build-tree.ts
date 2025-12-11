import { ParsedProject } from "@/features/project/types/project.types";
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
