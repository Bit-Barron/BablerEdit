import { useEffect } from "react";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { useSettingsStore } from "../stores/settings.store";
import { toast } from "sonner";
import parseJson from "parse-json";
import { RecentProjectProps } from "../types/settings.types";
import { getSettingsPath } from "../lib/settings-utils";

export const useSettings = () => {
  const { updateSettings } = useSettingsStore();

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const settingsPath = await getSettingsPath();
        const fileExists = await exists(settingsPath);

        if (fileExists) {
          const content = await readTextFile(settingsPath);
          const savedSettings = parseJson(content);

          updateSettings({
            recentProjects:
              savedSettings.recentProjects as unknown as RecentProjectProps[],
            darkMode: savedSettings.darkMode as boolean,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Failed: ${message}`);
        return null;
      }
    };

    loadUserSettings();
  }, []);
};
