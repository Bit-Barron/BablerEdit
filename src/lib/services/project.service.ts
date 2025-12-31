import { parseJSONFile } from "@/lib/helpers/json-parser";
import { serializeProject } from "@/lib/helpers/project-serializer";
import { FileWithPath, ParsedProject } from "@/lib/types/project.types";
import { flattenJson } from "@/lib/utils/flatten-json";
import { save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import yaml from "js-yaml";
import { open } from "@tauri-apps/plugin-dialog";
import { ReactArboristType } from "@/lib/types/editor.types";
import parseJson from "parse-json";
import * as FileService from "@/lib/services/file.service";
import { getSourceRootDir } from "@/lib/utils";

interface CreateProjectParams {
  files: FileWithPath[];
  framework: string;
  primaryLanguage: string;
}

interface CreateProjectResult {
  project: ParsedProject;
}

export async function createProject(
  params: CreateProjectParams
): Promise<CreateProjectResult> {
  const { files, framework, primaryLanguage } = params;
  let foundPrimaryLanguage = false;
  const langCodes = files.map((file) => file.name.split(".")[0]);

  let primaryFlat: Record<string, string> = {};
  for (const file of files) {
    if (file.name === `${primaryLanguage}.json`) {
      foundPrimaryLanguage = true;

      const json = await parseJSONFile({
        name: file.name,
        path: file.path,
        content: file.content,
        size: file.size,
      });
      primaryFlat = flattenJson(json);
      break;
    }
  }

  const firstFilePath = files[0].path;
  const source_root_dir = getSourceRootDir(firstFilePath);

  if (!foundPrimaryLanguage) {
    throw new Error(
      `Primary language file "${primaryLanguage}.json" is missing.`
    );
  }

  return {
    project: {
      version: "1.0.0",
      be_version: "1.0.0",
      framework,
      filename: "project.babler",
      source_root_dir: source_root_dir,
      is_template_project: false,

      languages: langCodes.map((code) => ({ code })),

      translation_packages: [
        {
          name: "main",
          translation_urls: files.map((file, i) => ({
            path: file.name,
            language: langCodes[i],
          })),
        },
      ],

      editor_configuration: {
        save_empty_translations: true,
        translation_order: "alphabetical",
        custom_languages: [],
        id_extractor_ignores: [],
      },

      primary_language: primaryLanguage,

      configuration: [
        {
          indent: "tab",
          format: "json",
          support_arrays: true,
        },
      ],

      preset_collections: [[]],

      folder_structure: {
        name: "",
        children: [
          {
            type: "package",
            name: "main",
            children: await Promise.all(
              Object.keys(primaryFlat).map(async (key) => ({
                type: "folder",
                name: key,
                description: "",
                comment: "",
                translations: await Promise.all(
                  files.map(async (file) => {
                    const langCode = file.name.split(".")[0];
                    const json = await parseJSONFile(file);
                    const flat = flattenJson(json);
                    return {
                      language: langCode,
                      value: flat[key] || "",
                      approved: false,
                    };
                  })
                ),
              }))
            ),
          },
        ],
      },
    },
  };
}
interface SaveProjectParams {
  project: ParsedProject;
  currentProjectPath: string | null;
}

interface SaveProjectResult {
  currentProjectPath: string;
  updatedProject: ParsedProject;
}

export async function saveProject(
  params: SaveProjectParams
): Promise<SaveProjectResult | null> {
  const { project, currentProjectPath } = params;

  try {
    if (!currentProjectPath || currentProjectPath.trim() === "") {
      const saveFile = await save({
        defaultPath: project.filename || "Project.babler",
        filters: [{ name: "BablerEdit Project", extensions: ["babler"] }],
      });

      if (!saveFile) {
        return null;
      }

      const bablerProject = serializeProject(project);
      const yamlContent = yaml.dump(bablerProject, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
      });

      await writeTextFile(saveFile, yamlContent);

      return {
        currentProjectPath: saveFile,
        updatedProject: bablerProject,
      };
    }

    const bablerProject = serializeProject(project);
    const yamlContent = yaml.dump(bablerProject, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    await writeTextFile(currentProjectPath, yamlContent);

    return {
      currentProjectPath: currentProjectPath,
      updatedProject: bablerProject,
    };
  } catch (error) {
    console.error("Error saving project:", error);
    throw new Error(
      `Failed to save project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
interface LoadProjectResult {
  project: ParsedProject;
  projectPath: string;
}

export async function LoadProject(): Promise<LoadProjectResult | void> {
  const openFile = await open({
    multiple: false,
    directory: false,
    filters: [{ extensions: ["babler"], name: "BablerEdit Project" }],
  });

  if (!openFile) return;

  const fileContent = await readTextFile(openFile);
  const parsedProject = yaml.load(fileContent);

  return {
    project: parsedProject as ParsedProject,
    projectPath: openFile,
  };
}

interface MoveJsonNodeProjectParams {
  project: ParsedProject;
}

export async function moveJsonNodeProject(
  params: MoveJsonNodeProjectParams & ReactArboristType
): Promise<{
  updatedProject: ParsedProject;
} | null> {
  const { dragIds, parentId, project } = params;

  const TRANSLATION_FILES = project.translation_packages[0].translation_urls;

  if (!dragIds || dragIds.length === 0) {
    throw new Error("No drag IDs provided");
  }

  try {
    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path;
      const jsonFilePath = `${project.source_root_dir}${filePath}`;

      const obj = await FileService.readTranslationFile({
        path: filePath,
        rootDir: project.source_root_dir,
      });

      const dragId = dragIds[0].split(".");
      const splitDragId = dragIds[0].split(".").slice(0, -1).join(".");

      // Check if moving to the same parent
      if (splitDragId === parentId) {
        throw new Error("Cannot move to the same parent");
      }

      let current: any = obj;
      let parent: any = null;

      for (let i = 0; i < dragId.length; i++) {
        parent = current;
        current = current[dragId[i]];
      }

      if (parent === null) {
        throw new Error("Cannot find parent of dragged item");
      }

      const movedValue = current;
      const movedKey = dragId[dragId.length - 1];

      delete parent[movedKey];

      let parentCurrent: any = obj;

      if (parentId === null || parentId === "") {
        parentCurrent[movedKey] = movedValue;
      } else {
        const splitParentId = parentId.split(".");

        for (let i = 0; i < splitParentId.length; i++) {
          if (!parentCurrent[splitParentId[i]]) {
            parentCurrent[splitParentId[i]] = {};
          }
          parentCurrent = parentCurrent[splitParentId[i]];
        }

        parentCurrent[movedKey] = movedValue;
      }

      const finalContent = JSON.stringify(obj, null, 2);
      await writeTextFile(jsonFilePath, finalContent);
    }

    const updatedProject = await updateProjectFolderStructure({
      project: project,
    });

    return {
      updatedProject: updatedProject.updatedProject,
    };
  } catch (error) {
    console.error("Error moving JSON node:", error);
    throw new Error(
      `Failed to move translation node: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

interface UpdateProjectFolderStructureParams {
  project: ParsedProject;
}

interface updateProjectFolderStructureResult {
  updatedProject: ParsedProject;
}

export async function updateProjectFolderStructure(
  params: UpdateProjectFolderStructureParams
): Promise<updateProjectFolderStructureResult> {
  const { project } = params;
  const loadedTranslations = await Promise.all(
    project.translation_packages[0].translation_urls.map(async (trans) => {
      const fullPath = `${project.source_root_dir}${trans.path}`;
      const jsonContent = await readTextFile(fullPath);
      return {
        language: trans.language,
        data: flattenJson(parseJson(jsonContent) as Record<string, string>),
      };
    })
  );
  const allKeys = Object.keys(loadedTranslations[0].data);

  const updatedProject: ParsedProject = {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: [
        {
          ...project.folder_structure.children[0],
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
  return {
    updatedProject: updatedProject,
  };
}
