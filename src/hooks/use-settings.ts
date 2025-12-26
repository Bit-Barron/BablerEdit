import { useEffect, useCallback } from "react";
import { useProjectStore } from "@/lib/store/project.store";
import { useNavigate } from "react-router-dom";
import * as SettingsService from "@/lib/services/settings.service";
import { useNotification } from "@/components/elements/glass-notification";
import { useSettingsStore } from "@/lib/store/setting.store";

let hasLoadedSettings = false; //** Ensure settings are loaded only once

export const useSettings = () => {
  const { setParsedProject, setProjectSnapshot } = useProjectStore();
  const navigate = useNavigate();
  const { loading, setLoading } = useProjectStore();
  const { setCurrentProjectPath } = useProjectStore();
  const { addNotification } = useNotification();
  const { setRecentProjects } = useSettingsStore();

  useEffect(() => {
    if (hasLoadedSettings) return; //** Prevent multiple loads

    const loadUserSettings = async () => {
      hasLoadedSettings = true;
      setLoading(true);
      try {
        const result = await SettingsService.loadUserSettings();

        if (result) {
          if (result.recentProjects) {
            setRecentProjects(Object.values(result.recentProjects));
          }

          if (result.lastOpenedProjectExist) {
            setParsedProject(result.parsedProject);
            setProjectSnapshot(result.parsedProject);
            setCurrentProjectPath(result.lastOpenedProjectPath as string);
            navigate("/editor");
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);

        addNotification({
          type: "error",
          title: "Failed to load settings",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  const handleRecentProjectClick = async (projectPath: string) => {
    const result = await SettingsService.recentProjectClick(projectPath);

    if (result) {
      setParsedProject(result.parsedProject);
      setProjectSnapshot(result.parsedProject);
      setCurrentProjectPath(projectPath);
      navigate("/editor");
    }
  };

  return { loading, handleRecentProjectClick };
};
