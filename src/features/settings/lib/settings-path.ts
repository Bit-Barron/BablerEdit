import { appDataDir } from "@tauri-apps/api/path";
import { SETTINGS_FILE } from "@/core/config/constants";

export const getSettingsPath = async (): Promise<string> => {
  const appDataPath = await appDataDir();
  const normalizedPath = appDataPath.endsWith("/")
    ? appDataPath
    : `${appDataPath}/`;
  return `${normalizedPath}${SETTINGS_FILE}`;
};
