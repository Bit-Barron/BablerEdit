import { SETTINGS_FILE } from "@/lib/config/constants.config";
import { appDataDir } from "@tauri-apps/api/path";
import { writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";

export const getSettingsPath = async (): Promise<string> => {
  const appDataPath = await appDataDir();
  const normalizedPath = appDataPath.endsWith("/")
    ? appDataPath
    : `${appDataPath}/`;
  return `${normalizedPath}${SETTINGS_FILE}`;
};

export const saveSettingsToFile = async (state: any) => {
  try {
    const appDataPath = await appDataDir();

    await mkdir(appDataPath, { recursive: true });

    const settingsPath = await getSettingsPath();

    console.log(settingsPath);

    const jsonContent: Record<string, unknown> = {
      recentProjects: state.recentProjects,
      darkMode: state.darkMode,
      lastOpenedProject: state.lastOpenedProject,
    };

    await writeTextFile(settingsPath, JSON.stringify(jsonContent, null, 2));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    toast.error(`Failed: ${message}`);
    return null;
  }
};
