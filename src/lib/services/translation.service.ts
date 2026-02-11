import { ParsedProject, Translation } from "@/lib/types/project.types";
import { TreeNodeType } from "@/lib/types/editor.types";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { NodeApi } from "react-arborist";
import * as projectService from "@/lib/services/project.service";
import * as FileService from "@/lib/services/file.service";

interface AddIdParams {
  selectedNodeId: string;
  newIdValue: string;
  project: ParsedProject;
}

export async function addTranslationId(
  params: AddIdParams
): Promise<ParsedProject> {
  const { selectedNodeId, newIdValue, project } = params;

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  for (let path in TRANSLATION_FILES) {
    const filePath = TRANSLATION_FILES[path].path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.readTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    if (!selectedNodeId) {
      obj[newIdValue] = "";
    } else {
      const splitSelectedNode = selectedNodeId!.split(".");
      let current: any = obj;
      let parent: any = null;

      for (let i = 0; i < splitSelectedNode.length; i++) {
        parent = current;
        current = current[splitSelectedNode[i]];
      }

      if (typeof current === "object") {
        current[newIdValue] = "";
      } else if (parent && typeof parent === "object") {
        parent[newIdValue] = "";
      }
    }

    const updateContent = JSON.stringify(obj, null, 2);
    await writeTextFile(jsonFilePath, updateContent);
  }

  const result = await projectService.updateProjectFolderStructure({
    project: project,
  });

  return result.updatedProject;
}

interface RemoveIdParams {
  selectedNodeId: string;
  project: ParsedProject;
}

export async function removeTranslationId(
  params: RemoveIdParams
): Promise<ParsedProject> {
  const { selectedNodeId, project } = params;

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  for (let path in TRANSLATION_FILES) {
    const filePath = TRANSLATION_FILES[path].path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.readTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    const splitSelectedNode = selectedNodeId.split(".");
    let current: any = obj;
    let parent: any = null;

    for (let i = 0; i < splitSelectedNode.length; i++) {
      parent = current;
      current = current[splitSelectedNode[i]];
    }

    if (parent && splitSelectedNode.length > 0) {
      delete parent[splitSelectedNode[splitSelectedNode.length - 1]];
    }

    const updateContent = JSON.stringify(obj, null, 2);
    await writeTextFile(jsonFilePath, updateContent);
  }

  const result = await projectService.updateProjectFolderStructure({
    project: project,
  });

  return result.updatedProject;
}

interface ToggleApprovalParams {
  project: ParsedProject;
  language: string;
  selectedNodeId: NodeApi<TreeNodeType>;
}

export function toggleTranslationApproval(params: ToggleApprovalParams) {
  const { project, language, selectedNodeId } = params;

  const obj = project.folder_structure.children[0].children;
  const findNode = obj.find((child) => child.name === selectedNodeId?.data.id);

  if (!findNode) {
    throw new Error(
      `Translation key "${selectedNodeId?.data.id || "undefined"
      }" not found in project. Unable to toggle approval for language "${language}".`
    );
  }

  const updatedTranslations = findNode?.translations.map((t) => {
    if (t.language === language) {
      return { ...t, approved: !t.approved };
    }
    return t;
  });

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: [
        {
          ...project.folder_structure.children[0],
          children: project.folder_structure.children[0].children.map((node) =>
            node.name === selectedNodeId.data.id
              ? { ...node, translations: updatedTranslations! }
              : node
          ),
        },
      ],
    },
  };

  return {
    updatedProject,
    updatedTranslations,
    isApproved: updatedTranslations!.find((t) => t.language === language)!,
  };
}

interface UpdateTranslationParams {
  project: ParsedProject;
  selectedNode: NodeApi<TreeNodeType>;
  newValue: string;
  language: string;
}

interface UpdateTranslationResult {
  updatedProject: ParsedProject;
  updatedTranslations: Translation[];
}

export async function updateTranslations(
  params: UpdateTranslationParams
): Promise<UpdateTranslationResult> {
  const { project, selectedNode, newValue, language } = params;
  const obj = project.folder_structure.children[0].children;
  const findNode = obj.find((child) => child.name === selectedNode.data.id);
  if (!findNode) {
    throw new Error(
      `Translation key "${selectedNode.data.id}" not found in project. Unable to update value for language "${language}".`
    );
  }

  const updatedTranslations = findNode?.translations.map((t) => {
    if (t.language === language) {
      return { ...t, value: newValue };
    }
    return t;
  });
  const updatedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: [
        {
          ...project.folder_structure.children[0],
          children: project.folder_structure.children[0].children.map((node) =>
            node.name === selectedNode.data.id
              ? { ...node, translations: updatedTranslations! }
              : node
          ),
        },
      ],
    },
  };

  return {
    updatedProject: updatedProject,
    updatedTranslations: updatedTranslations,
  };
}

interface addCommentParams {
  project: ParsedProject;
  selectedNodeId: NodeApi<TreeNodeType>;
  comment: string;
}

interface addCommentResult {
  updatedProject: ParsedProject;
}

export function addCommentToTranslationId(
  params: addCommentParams
): addCommentResult {
  const { project, selectedNodeId, comment } = params;

  const obj = project.folder_structure.children[0].children;

  const findNode = obj.find((child) => child.name === selectedNodeId?.data.id);

  if (!findNode) {
    throw new Error(
      `Translation key "${selectedNodeId?.data.id || "undefined"
      }" not found in project. Unable to add comment.`
    );
  }

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: [
        {
          ...project.folder_structure.children[0],
          children: project.folder_structure.children[0].children.map((node) =>
            node.name === selectedNodeId.data.id
              ? { ...node, comment: comment }
              : node
          ),
        },
      ],
    },
  };

  return {
    updatedProject: updatedProject,
  };
}

interface RenameTranslationIdParams {
  oldId: string;
  newId: string;
  project: ParsedProject;
}

export async function renameTranslationId(
  params: RenameTranslationIdParams
): Promise<ParsedProject> {
  const { oldId, newId, project } = params;

  if (oldId === newId) return project;

  const existing = project.folder_structure.children[0].children.find(
    (c) => c.name === newId
  );
  if (existing) {
    throw new Error(`Translation ID "${newId}" already exists.`);
  }

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  for (const trans of TRANSLATION_FILES) {
    const filePath = trans.path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.readTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    const oldKeys = oldId.split(".");
    const newKeys = newId.split(".");

    // Get the value at old path
    let current: any = obj;
    let parent: any = null;
    for (let i = 0; i < oldKeys.length; i++) {
      parent = current;
      current = current?.[oldKeys[i]];
    }

    const value = current;

    // Delete old key
    if (parent && oldKeys.length > 0) {
      delete parent[oldKeys[oldKeys.length - 1]];
    }

    // Set new key
    let target: any = obj;
    for (let i = 0; i < newKeys.length - 1; i++) {
      if (!target[newKeys[i]] || typeof target[newKeys[i]] !== "object") {
        target[newKeys[i]] = {};
      }
      target = target[newKeys[i]];
    }
    target[newKeys[newKeys.length - 1]] = value;

    await writeTextFile(jsonFilePath, JSON.stringify(obj, null, 2));
  }

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: project.folder_structure.children.map((pkg) => ({
        ...pkg,
        children: pkg.children.map((node) =>
          node.name === oldId ? { ...node, name: newId } : node
        ),
      })),
    },
  };

  return updatedProject;
}

interface DuplicateIdParams {
  sourceId: string;
  project: ParsedProject;
}

export async function duplicateTranslationId(
  params: DuplicateIdParams
): Promise<ParsedProject> {
  const { sourceId, project } = params;

  const existing = project.folder_structure.children[0].children;

  // Build new ID: keep same parent path, append _COPY to leaf
  const parts = sourceId.split(".");
  const lastPart = parts[parts.length - 1];
  parts[parts.length - 1] = `${lastPart}_COPY`;
  let newId = parts.join(".");
  let counter = 1;
  while (existing.find((c) => c.name === newId)) {
    parts[parts.length - 1] = `${lastPart}_COPY_${counter}`;
    newId = parts.join(".");
    counter++;
  }

  // Update all translation files on disk
  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;
  for (const trans of TRANSLATION_FILES) {
    const filePath = trans.path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.readTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    // Read value at source path
    const sourceKeys = sourceId.split(".");
    let current: any = obj;
    for (const key of sourceKeys) {
      current = current?.[key];
    }
    const value = current;

    // Write value at new path
    const newKeys = newId.split(".");
    let target: any = obj;
    for (let i = 0; i < newKeys.length - 1; i++) {
      if (!target[newKeys[i]] || typeof target[newKeys[i]] !== "object") {
        target[newKeys[i]] = {};
      }
      target = target[newKeys[i]];
    }
    target[newKeys[newKeys.length - 1]] = value;

    await writeTextFile(jsonFilePath, JSON.stringify(obj, null, 2));
  }

  // Update project structure
  const sourceConcept = existing.find((c) => c.name === sourceId);
  if (!sourceConcept) throw new Error(`Source concept "${sourceId}" not found`);

  const newConcept = {
    ...sourceConcept,
    name: newId,
    translations: sourceConcept.translations.map((t) => ({ ...t, approved: false })),
  };

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: project.folder_structure.children.map((pkg) => ({
        ...pkg,
        children: [...pkg.children, newConcept],
      })),
    },
  };

  return updatedProject;
}

interface PasteTranslationIdParams {
  sourceId: string;
  targetParentId: string | null;
  mode: "cut" | "copy";
  project: ParsedProject;
}

export async function pasteTranslationId(
  params: PasteTranslationIdParams
): Promise<ParsedProject> {
  const { sourceId, targetParentId, mode, project } = params;

  const existing = project.folder_structure.children[0].children;

  // Build target ID: put the leaf name under the target parent
  const sourceParts = sourceId.split(".");
  const leafName = sourceParts[sourceParts.length - 1];

  let newId: string;
  if (targetParentId) {
    newId = `${targetParentId}.${leafName}`;
  } else {
    newId = leafName;
  }

  // If same location, append _COPY suffix (for copy mode or if target == source parent)
  if (newId === sourceId || existing.find((c) => c.name === newId)) {
    const baseParts = newId.split(".");
    const baseLast = baseParts[baseParts.length - 1];
    baseParts[baseParts.length - 1] = `${baseLast}_COPY`;
    newId = baseParts.join(".");
    let counter = 1;
    while (existing.find((c) => c.name === newId)) {
      baseParts[baseParts.length - 1] = `${baseLast}_COPY_${counter}`;
      newId = baseParts.join(".");
      counter++;
    }
  }

  // Update all translation files on disk
  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;
  for (const trans of TRANSLATION_FILES) {
    const filePath = trans.path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.readTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    // Read value at source path
    const sourceKeys = sourceId.split(".");
    let current: any = obj;
    for (const key of sourceKeys) {
      current = current?.[key];
    }
    const value = current;

    // Write value at new path
    const newKeys = newId.split(".");
    let target: any = obj;
    for (let i = 0; i < newKeys.length - 1; i++) {
      if (!target[newKeys[i]] || typeof target[newKeys[i]] !== "object") {
        target[newKeys[i]] = {};
      }
      target = target[newKeys[i]];
    }
    target[newKeys[newKeys.length - 1]] = value;

    // If cut, delete the source
    if (mode === "cut") {
      let parent: any = obj;
      for (let i = 0; i < sourceKeys.length - 1; i++) {
        parent = parent?.[sourceKeys[i]];
      }
      if (parent && typeof parent === "object") {
        delete parent[sourceKeys[sourceKeys.length - 1]];
      }
    }

    await writeTextFile(jsonFilePath, JSON.stringify(obj, null, 2));
  }

  // Update project structure
  const sourceConcept = existing.find((c) => c.name === sourceId);
  if (!sourceConcept) throw new Error(`Source concept "${sourceId}" not found`);

  const newConcept = {
    ...sourceConcept,
    name: newId,
    translations: sourceConcept.translations.map((t) => ({
      ...t,
      approved: mode === "copy" ? false : t.approved,
    })),
  };

  let updatedChildren = [...existing, newConcept];
  if (mode === "cut") {
    updatedChildren = updatedChildren.filter((c) => c.name !== sourceId);
  }

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: project.folder_structure.children.map((pkg) => ({
        ...pkg,
        children: updatedChildren,
      })),
    },
  };

  return updatedProject;
}

interface RemoveTranslationUrlParams {
  project: ParsedProject;
  translation: string;
}

export async function removeTranslationUrl(params: RemoveTranslationUrlParams) {
  const { project, translation } = params;

  const updatedTranslationPackages: ParsedProject["translation_packages"] = project.translation_packages.map((tp) => ({
    ...tp,
    translation_urls: tp.translation_urls.filter(
      (url) => url.language !== translation
    ),
  }));

  const updatedLanguages: ParsedProject["languages"] = project.languages.filter(
    (lang) => lang.code !== translation
  );

  const updatedFolderStructure: ParsedProject["folder_structure"] = {
    ...project.folder_structure,
    children: project.folder_structure.children.map((pkg) => ({
      ...pkg,
      children: pkg.children.map((node) => ({
        ...node,
        translations: node.translations.filter(
          (t) => t.language !== translation
        ),
      })),
    })),
  };

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: updatedFolderStructure,
    translation_packages: updatedTranslationPackages,
    languages: updatedLanguages,
  };

  return updatedProject;
}
