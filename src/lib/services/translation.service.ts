import { ParsedProject } from "@/lib/types/project.types";
import { TreeNodeType } from "@/lib/types/tree.types";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { NodeApi } from "react-arborist";
import * as projectService from "@/lib/services/project.service";
import * as FileService from "@/lib/services/file.service";

interface AddIdParams {
  selectedNodeId: string;
  newIdValue: string;
  project: ParsedProject;
}

interface AddIdResult {
  updatedProject: ParsedProject;
  addedId: string;
}

export async function addTranslationId(
  params: AddIdParams
): Promise<AddIdResult> {
  const { selectedNodeId, newIdValue, project } = params;

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  for (let path in TRANSLATION_FILES) {
    const filePath = TRANSLATION_FILES[path].path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.writeTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    const splitSelectedNode = selectedNodeId.split(".");
    let current: any = obj;
    let parent: any = "";

    for (let i = 0; i < splitSelectedNode.length; i++) {
      parent = current;
      current = current[splitSelectedNode[i]];
    }

    if (typeof current === "object") {
      current[newIdValue] = "";
    } else {
      parent[newIdValue] = "";
    }
    const updateContent = JSON.stringify(obj, null, 2);
    writeTextFile(jsonFilePath, updateContent);
  }

  const updatedProject = await projectService.updateProjectFolderStructure({
    project: project,
  });

  return {
    updatedProject: updatedProject as unknown as ParsedProject,
    addedId: newIdValue,
  };
}

interface RemoveIdParams {
  selectedNodeId: string;
  project: ParsedProject;
}

interface RemoveIdResult {
  updatedProject: ParsedProject;
  removeId: string;
}

export async function removeTranslationId(
  params: RemoveIdParams
): Promise<RemoveIdResult> {
  const { selectedNodeId, project } = params;

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  for (let path in TRANSLATION_FILES) {
    const filePath = TRANSLATION_FILES[path].path;
    const jsonFilePath = `${project.source_root_dir}${filePath}`;
    const obj = await FileService.writeTranslationFile({
      path: filePath,
      rootDir: project.source_root_dir,
    });

    const splitSelectedNode = selectedNodeId.split(".");
    let current: any = obj;
    let parent: any = "";

    for (let i = 0; i < splitSelectedNode.length; i++) {
      parent = current;
      current = current[splitSelectedNode[i]];
    }

    delete parent[splitSelectedNode[splitSelectedNode.length - 1]];

    const updateContent = JSON.stringify(obj, null, 2);
    writeTextFile(jsonFilePath, updateContent);
  }

  const updatedProject = await projectService.updateProjectFolderStructure({
    project: project,
  });

  return {
    updatedProject: updatedProject as unknown as ParsedProject,
    removeId: selectedNodeId,
  };
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
