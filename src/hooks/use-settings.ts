import { useEffect } from "react";
import { toast } from "sonner";
import { useProjectStore } from "@/lib/store/project.store";
import { ParsedProject } from "@/lib/types/project.types";
import { useNavigate } from "react-router-dom";
import * as SettingsService from "@/lib/services/settings.service";

export const useSettings = () => {
  const { setParsedProject, setProjectSnapshot } = useProjectStore();
  const navigate = useNavigate();
  const { loading, setLoading } = useProjectStore();
  const { setCurrentProjectPath } = useProjectStore();

  useEffect(() => {
    const loadUserSettings = async () => {
      setLoading(true);
      try {
        const result = await SettingsService.loadUserSettings();

        if (!result.settingsExist) {
          setLoading(false);
          return;
        }

        if (!result.lastOpenedProjectPath) {
          setLoading(false);
          return;
        }

        if (!result.lastOpenedProjectExist) {
          toast.warning("Last opened project not found");
          setLoading(false);
          return;
        }

        setParsedProject(result.parsedProject as ParsedProject);
        setProjectSnapshot(result.parsedProject as ParsedProject);
        setCurrentProjectPath(result.lastOpenedProjectPath);
        navigate("/editor");
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load last opened project");
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  return { loading };
};
