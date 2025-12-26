import { useEffect } from "react";
import { useProjectStore } from "@/lib/store/project.store";
import { ParsedProject } from "@/lib/types/project.types";
import { useNavigate } from "react-router-dom";
import * as SettingsService from "@/lib/services/settings.service";
import { useNotification } from "@/components/elements/glass-notification";

export const useSettings = () => {
  const { setParsedProject, setProjectSnapshot } = useProjectStore();
  const navigate = useNavigate();
  const { loading, setLoading } = useProjectStore();
  const { setCurrentProjectPath } = useProjectStore();
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadUserSettings = async () => {
      setLoading(true);
      try {
        const result = await SettingsService.loadUserSettings();

        if (!result) {
          throw new Error("No settings found");
        }

        setParsedProject(result.parsedProject as ParsedProject);
        setProjectSnapshot(result.parsedProject as ParsedProject);
        setCurrentProjectPath(result.lastOpenedProjectPath as string);
        navigate("/editor");
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

  return { loading };
};
