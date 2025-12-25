import { ParsedProject } from "@/lib/types/project.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import { ReactArboristType } from "../lib/types/tree.types";
import { serializeProject } from "@/lib/helpers/project-serializer";
import { updateProjectFolderStructure } from "@/lib/services/project-updater.service";
import { readTranslationFile } from "@/lib/utils/file-reader";
import { useProjectStore } from "@/lib/store/project.store";
import { useSettingsStore } from "@/lib/store/setting.store";
import { useNotification } from "@/components/elements/glass-notification";

export const useEditor = () => {
  const { addRecentProject, setLastOpenedProject } = useSettingsStore();
  const { setParsedProject, parsedProject, setHasUnsavedChanges } =
    useProjectStore();
  const { setCurrentProjectPath, currentProjectPath } = useProjectStore();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | null> => {
    try {
      if (!currentProjectPath) {
        const saveFile = await save({
          defaultPath: project.filename || "Project.babler",
          filters: [{ name: "BablerEdit Project", extensions: ["babler"] }],
        });

        if (!saveFile) return null;
        setCurrentProjectPath(saveFile);

        const bablerProject = serializeProject(project);
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

        setLastOpenedProject(saveFile);
        setHasUnsavedChanges(false);

        addNotification({
          type: "success",
          title: "Project saved!",
          description: `Saved to ${saveFile}`,
        });
        return bablerProject;
      } else {
        const bablerProject = serializeProject(project);
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
        setLastOpenedProject(currentProjectPath);
        setHasUnsavedChanges(false);

        addNotification({
          type: "success",
          title: "Project saved!",
          description: `Saved to ${currentProjectPath}`,
        });
        return bablerProject;
      }
    } catch (err) {
      console.error(err);
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
        filters: [{ extensions: ["babler"], name: "BablerEdit Project" }],
      });

      if (!openFile) return;
      setCurrentProjectPath(openFile);

      const fileContent = await readTextFile(openFile);
      const parsedProject = yaml.load(fileContent);

      setParsedProject(parsedProject as ParsedProject);
      addNotification({
        type: "success",
        title: "Project opened!",
        description: `Opened ${openFile}`,
      });
      setLastOpenedProject(openFile);
      navigate("/editor");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };

  const moveJsonNode = async ({ dragIds, parentId }: ReactArboristType) => {
    try {
      const TRANSLATION_FILES =
        parsedProject.translation_packages[0].translation_urls;

      if (!dragIds || !parentId) return;

      for (let path in TRANSLATION_FILES) {
        const filePath = TRANSLATION_FILES[path].path;
        const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;

        const obj = await readTranslationFile(
          parsedProject.source_root_dir,
          filePath
        );

        const dragId = dragIds[0].split(".");
        const splitParentId = parentId.split(".");

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

        delete parent[dragId[dragId.length - 1]];

        let parentCurrent: any = obj;
        for (let i = 0; i < splitParentId.length; i++) {
          parentCurrent = parentCurrent[splitParentId[i]];
        }

        parentCurrent[dragId[dragId.length - 1]] = current;

        const finalContent = JSON.stringify(obj, null, 2);
        await writeTextFile(jsonFilePath, finalContent);
      }

      const updatedProject = await updateProjectFolderStructure(parsedProject);
      addNotification({
        type: "success",
        title: "ID moved!",
        description: `"${dragIds[0]}" moved successfully`,
      });
      setParsedProject(updatedProject as ParsedProject);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };

  return {
    saveProject,
    openProject,
    moveJsonNode,
  };
};
