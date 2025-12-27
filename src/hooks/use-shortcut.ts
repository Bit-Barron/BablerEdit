import { register } from "@tauri-apps/plugin-global-shortcut";
import { useProjectStore } from "@/lib/store/project.store";
import { useEffect } from "react";
import * as ProjectService from "@/lib/services/project.service";

let isRegistered = false;

export const useShortcut = () => {
  const {
    setParsedProject,
    setCurrentProjectPath,
    setProjectSnapshot,
    setHasUnsavedChanges,
    parsedProject,
    currentProjectPath,
  } = useProjectStore();

  useEffect(() => {
    if (isRegistered) return;

    register("CommandOrControl+S", async () => {
      if (parsedProject && Object.keys(parsedProject).length > 0) {
        await ProjectService.saveProject({
          project: parsedProject,
          currentProjectPath: currentProjectPath,
        }).then((result) => {
          if (result) {
            setParsedProject(result.updatedProject);
            setCurrentProjectPath(result.currentProjectPath);
            setProjectSnapshot(result.updatedProject);
            setHasUnsavedChanges(false);
          }
        });
      }
    }).catch(console.error);

    isRegistered = true;
  }, []);
};
