import { ParsedProject } from "@/lib/types/project.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ReactArboristType } from "../lib/types/tree.types";
import { useProjectStore } from "@/lib/store/project.store";
import { useSettingsStore } from "@/lib/store/setting.store";
import { useNotification } from "@/components/elements/glass-notification";
import * as ProjectService from "@/lib/services/project.service";
import dayjs from "dayjs";

export const useEditor = () => {
  const { setLastOpenedProject, addRecentProject } = useSettingsStore();
  const { setParsedProject, setProjectSnapshot, parsedProject } =
    useProjectStore();
  const { setCurrentProjectPath, setHasUnsavedChanges, currentProjectPath } =
    useProjectStore();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | null> => {
    try {
      const result = await ProjectService.saveProject({
        project,
        currentProjectPath: currentProjectPath,
      });

      if (!result) return null;

      setCurrentProjectPath(result.currentProjectPath);

      addRecentProject({
        path: result.currentProjectPath,
        name: project.filename,
        framework: project.framework,
        language: project.primary_language,
        lastModified: dayjs().toISOString(),
      });

      setLastOpenedProject(result.currentProjectPath);
      setProjectSnapshot(project);
      setHasUnsavedChanges(false);

      addNotification({
        type: "success",
        title: "Project saved!",
        description: `Saved to ${result.currentProjectPath}`,
      });

      return project;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };
  const openProject = async () => {
    try {
      const loadResult = await ProjectService.LoadProject();

      setParsedProject(loadResult?.project as ParsedProject);
      setProjectSnapshot(loadResult?.project as ParsedProject);

      addNotification({
        type: "success",
        title: "Project opened!",
        description: `Opened ${loadResult?.project.filename || "project"}`,
      });
      setLastOpenedProject(loadResult?.projectPath as string);
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
      const result = await ProjectService.moveJsonNodeProject({
        dragIds,
        parentId,
        project: parsedProject!,
      });
      addNotification({
        type: "success",
        title: "ID moved!",
        description: `"${dragIds[0]}" moved successfully`,
      });
      setParsedProject(result?.updatedProject as ParsedProject);
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
