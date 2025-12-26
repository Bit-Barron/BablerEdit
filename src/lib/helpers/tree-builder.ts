import { TreeNodeType } from "@/lib/types/tree.types";

export const buildTranslationTree = (projectData: any): TreeNodeType[] => {
  const allKeys: string[] = [];
  const project = projectData;

  const mainPackage = project?.folder_structure?.children?.[0];
  if (!mainPackage || !mainPackage.children) {
    return [];
  }

  for (let i of mainPackage.children) {
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
      if (idx < parts.length - 1) {
        current = current[part];
      }
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
