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
    writeTextFile(jsonFilePath, updateContent);
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
    writeTextFile(jsonFilePath, updateContent);
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
    throw new Error(`Translation key "${selectedNodeId}" not found.`);
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
            node.name === selectedNodeId.data.id //TODO when using this service parse selectedNode.data.id
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
    throw new Error(`Translation key "${selectedNode.data.id}" not found.`);
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
    throw new Error(`Translation key "${selectedNodeId}" not found.`);
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
