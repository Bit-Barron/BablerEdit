import { useEffect } from "react";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import parseJson from "parse-json";
import { getSettingsPath } from "../lib/utils/settings-utils";
import { useProjectStore } from "@/lib/store/project.store";
import { ParsedProject } from "@/lib/types/project.types";
import yaml from "js-yaml";
import { useNavigate } from "react-router-dom";

export const useSettings = () => {
  const { setParsedProject } = useProjectStore();
  const navigate = useNavigate();
  const { loading, setLoading } = useProjectStore();

  useEffect(() => {
    const loadUserSettings = async () => {
      setLoading(true);
      try {
        const settingsPath = await getSettingsPath();
        const fileExists = await exists(settingsPath);

        if (!fileExists) {
          setLoading(false);
          return;
        }

        const content = await readTextFile(settingsPath);
        const savedSettings = parseJson(content);

        if (!savedSettings.lastOpenedProject) {
          setLoading(false);
          return;
        }

        // Check if the last opened project file still exists
        const projectExists = await exists(savedSettings.lastOpenedProject as string);

        if (!projectExists) {
          toast.warning("Last opened project not found");
          setLoading(false);
          return;
        }

        const readLastOpenedProject = await readTextFile(
          savedSettings.lastOpenedProject as string
        );

        const parsedProject = yaml.load(readLastOpenedProject);
        setParsedProject(parsedProject as ParsedProject);
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
