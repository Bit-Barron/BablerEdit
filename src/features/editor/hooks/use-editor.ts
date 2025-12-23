import { useProjectStore } from "@/features/project/store/project.store";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { TranslationManagerService } from "@/features/editor/services/translation-manager.service";
import { ReactArboristType } from "../types/tree.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import dayjs from "dayjs";
import { updateProjectFolderStructure } from "@/features/editor/lib/project-updater";
import { ParsedProject } from "@/features/project/types/project.types";
import { ProjectPersistenceService } from "@/features/project/services/project-persistence.service";

export const useEditor = () => {
  const {
    parsedProject,
    setParsedProject,
    currentProjectPath,
    setCurrentProjectPath,
  } = useProjectStore();
  const { addRecentProject } = useSettingsStore();
  const navigate = useNavigate();

  const persistence = useMemo(() => new ProjectPersistenceService(), []);

  const manager = useMemo(
    () => parsedProject && new TranslationManagerService(parsedProject),
    [parsedProject]
  );

  const saveProject = async () => {
    if (!parsedProject) {
      toast.error("No project loaded");
      return;
    }

    try {
      const { path, project } = await persistence.saveProject(
        parsedProject,
        currentProjectPath
      );

      setCurrentProjectPath(path);

      addRecentProject({
        path,
        name: project.filename,
        framework: project.framework,
        language: project.primary_language,
        lastModified: dayjs().toISOString(),
      });

      toast.success(`Project saved: ${path}`);
    } catch (error) {
      if (error instanceof Error && error.message === "Save cancelled") return;
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save: ${message}`);
    }
  };

  const openProject = async () => {
    try {
      const { path, project } = await persistence.openProject();

      setCurrentProjectPath(path);
      setParsedProject(project);

      addRecentProject({
        path,
        name: project.filename,
        framework: project.framework,
        language: project.primary_language,
        lastModified: dayjs().toISOString(),
      });

      toast.success(`Project opened: ${path}`);
      navigate("/editor");
    } catch (error) {
      if (error instanceof Error && error.message === "Open cancelled") return;
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to open: ${message}`);
    }
  };

  const moveJsonNode = async ({ dragIds, parentId }: ReactArboristType) => {
    if (!dragIds || !parentId || !parsedProject || !manager) return;

    try {
      const dragId = dragIds[0];
      const dragParent = dragId.split(".").slice(0, -1).join(".");

      if (dragParent === parentId) {
        toast.error("Cannot move within same parent");
        return;
      }

      await manager.moveId(dragId, parentId);

      const updated = await updateProjectFolderStructure(parsedProject);
      setParsedProject(updated as ParsedProject);

      toast.success(`ID "${dragId}" moved successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to move: ${message}`);
    }
  };

  return {
    saveProject,
    openProject,
    moveJsonNode,
  };
};
