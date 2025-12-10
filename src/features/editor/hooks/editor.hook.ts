import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { ProjectHelper } from "../lib/project-helper";
import { toast } from "sonner";
import dayjs from "dayjs";
import parseJson from "parse-json";
import { updateProjectFolderStructure } from "@/features/id/lib/update-structure";

export const useEditorHook = () => {
  const { addRecentProject } = useSettingsStore();
  const { setParsedProject, parsedProject } = useFileManagerStore();
  const { setCurrentProjectPath, currentProjectPath } = useFileManagerStore();
  const navigate = useNavigate();

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | null> => {
    try {
      if (!currentProjectPath) {
        const saveFile = await save({
          defaultPath: project.filename || "Project.babler",
          filters: [
            {
              name: "BablerEdit Project",
              extensions: ["babler"],
            },
          ],
        });

        if (!saveFile) return null;
        setCurrentProjectPath(saveFile);

        const bablerProject = ProjectHelper(project);

        const yamlContent = yaml.dump(bablerProject, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });

        await writeTextFile(saveFile, yamlContent);

        addRecentProject({
          path: saveFile,
          name: project.filename,
          framework: project.framework,
          language: project.primary_language,
          lastModified: dayjs().toISOString(),
        });

        toast.success(`Project saved successfully ${saveFile}`);

        return bablerProject;
      } else {
        const bablerProject = ProjectHelper(project);

        const yamlContent = yaml.dump(bablerProject, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });

        await writeTextFile(currentProjectPath, yamlContent);

        addRecentProject({
          path: currentProjectPath,
          name: project.filename,
          framework: project.framework,
          language: project.primary_language,
          lastModified: dayjs().toISOString(),
        });

        toast.success(`Project saved successfully ${currentProjectPath}`);

        return bablerProject;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };

  const openProject = async () => {
    try {
      const openFile = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            extensions: ["babler"],
            name: "BablerEdit Project",
          },
        ],
      });

      if (!openFile) return;
      setCurrentProjectPath(openFile); // set the current project path

      const fileContent = await readTextFile(openFile);
      const parsedProject = yaml.load(fileContent);

      setParsedProject(parsedProject as ParsedProject);

      toast.success(`Project opened successfully ${openFile}`);
      navigate("/editor");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);

      return null;
    }
  };

  const handleJsonMove = async ({
    dragIds,
    parentId,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    try {
      const TRANSLATION_FILES =
        parsedProject.translation_packages[0].translation_urls;

      for (let path in TRANSLATION_FILES) {
        const filePath = TRANSLATION_FILES[path].path;
        const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
        const content = await readTextFile(jsonFilePath);
        const obj = parseJson(content);
        const dragId = dragIds[0].split(".");
        const splitParentId = parentId!.split(".");

        let current: any = obj;
        let parent: any = "";

        const splitDragId = dragIds[0].split(".").slice(0, -1).join(".");

        if (splitDragId === parentId) {
          toast.error("Moving within the same parent is not working.");
          return;
        }

        for (let i = 0; i < dragId.length; i++) {
          parent = current;
          current = current[dragId[i]];
        }

        const valueToMove = current;
        delete parent[dragId[dragId.length - 1]];

        let parentCurrent: any = obj;
        for (let i = 0; i < splitParentId.length; i++) {
          parentCurrent = parentCurrent[splitParentId[i]];
        }

        parentCurrent[dragId[dragId.length - 1]] = valueToMove;

        const finalContent = JSON.stringify(obj, null, 2);
        await writeTextFile(jsonFilePath, finalContent);
      }

      const updatedProject = await updateProjectFolderStructure(parsedProject);

      toast.success(`ID "${dragIds[0]}" moved successfully in JSON files`);
      setParsedProject(updatedProject as ParsedProject);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };

  return {
    saveProject,
    openProject,
    handleJsonMove,
  };
};
