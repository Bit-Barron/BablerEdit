import { ParsedProject } from "@/features/translation/types/parser.types";
import { TreeNode } from "../types/editor.types";

export const buildTranslationTree = (
  projectData: ParsedProject
): TreeNode[] => {
  if (!projectData?.folder_structure) return [];

  const allKeys = projectData.folder_structure.children.flatMap((pkg) =>
    pkg.children.map((concept) => concept.name)
  );

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
  ): TreeNode[] => {
    return Object.entries(obj).map(([name, child]) => {
      const fullPath = parentPath ? `${parentPath}.${name}` : name;

      if (child === null) {
        return { id: fullPath, name } as TreeNode;
      }

      return {
        id: fullPath,
        name,
        children: convert(child, fullPath),
      } as TreeNode;
    });
  };

  return convert(tree);
};
