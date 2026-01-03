import { ParsedProject } from "@/lib/types/project.types";
import { useNavigate } from "react-router-dom";
import { ReactArboristType } from "@/lib/types/editor.types";
import { useProjectStore } from "@/lib/store/project.store";
import { useSettingsStore } from "@/lib/store/setting.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useNotification } from "@/components/elements/toast-notification";
import * as ProjectService from "@/lib/services/project.service";
import dayjs from "dayjs";
import { useMemo } from "react";
import { filterItems, useHandleOpenCommandPalette } from "react-cmdk";

export const useEditor = () => {
  const { setLastOpenedProject, addRecentProject } = useSettingsStore();
  const { setParsedProject, setProjectSnapshot, parsedProject } =
    useProjectStore();
  const { setCurrentProjectPath, setHasUnsavedChanges, currentProjectPath } =
    useProjectStore();
  const {
    setAddIdDialogOpen,
    search,
    setSearch,
    setCommandPaletteOpen,
    commandPalettenOpen,
  } = useEditorStore();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  useHandleOpenCommandPalette(setCommandPaletteOpen);

  const ids = useMemo(() => {
    const result: string[] = [];
    if (!parsedProject?.folder_structure?.children) return result;

    for (let i = 0; i < parsedProject.folder_structure.children.length; i++) {
      const child = parsedProject.folder_structure.children[i]?.children;
      if (!child) continue;
      for (let j in child) {
        result.push(child[j].name);
      }
    }
    return result;
  }, [parsedProject]);

  const filteredItems = filterItems(
    [
      {
        heading: "Actions",
        id: "actions",
        items: [
          {
            id: "add-translation",
            children: "Add Translation ID",
            icon: "PlusIcon",
            onClick: () => {
              setAddIdDialogOpen(true);
            },
          },
        ],
      },
      {
        heading: "Translation IDs",
        id: "translation-ids",
        items: ids.map((id) => ({
          id: `id-${id}`,
          children: id,
          icon: "DocumentTextIcon",
          onClick: () => { },
        })),
      },
    ],
    search
  );

  const commandPalette = {
    isOpen: commandPalettenOpen,
    setIsOpen: setCommandPaletteOpen,
    search,
    setSearch,
    filteredItems,
  };

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | null> => {
    try {
      const shouldPromptForPath =
        !currentProjectPath || currentProjectPath.trim() === "";

      const result = await ProjectService.saveProject({
        project,
        currentProjectPath: shouldPromptForPath ? null : currentProjectPath,
      });

      if (!result) {
        addNotification({
          type: "error",
          title: "Save cancelled",
          description: "Project save was cancelled.",
        });
        return null;
      }
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
      console.error("Save error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to save project",
        description: message,
      });
      return null;
    }
  };

  const openProject = async () => {
    try {
      const loadResult = await ProjectService.LoadProject();

      if (!loadResult?.project) return;

      setParsedProject(loadResult?.project as ParsedProject);
      setProjectSnapshot(loadResult?.project as ParsedProject);

      setCurrentProjectPath(loadResult?.projectPath);

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
      addNotification({
        type: "error",
        title: "Failed to open project",
        description: message,
      });
      return null;
    }
  };

  const moveJsonNode = async ({
    dragIds,
    dragNodes,
    parentId,
    parentNode,
    index,
  }: ReactArboristType): Promise<void> => {
    try {
      const result = await ProjectService.moveJsonNodeProject({
        dragIds,
        dragNodes,
        parentId,
        parentNode,
        index,
        project: parsedProject!,
      });
      addNotification({
        type: "success",
        title: "ID moved!",
        description: `"${dragIds[0]}" moved successfully`,
      });

      if (result) {
        setParsedProject(result.updatedProject as ParsedProject);
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to move ID",
        description: message,
      });
    }
  };

  return {
    saveProject,
    openProject,
    moveJsonNode,
    commandPalette,
  };
};
