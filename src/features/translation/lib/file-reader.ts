import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";

export const readTranslationFile = async (
  rootDir: string,
  path: string
): Promise<Record<string, any>> => {
  const fullPath = `${rootDir}${path}`;
  const content = await readTextFile(fullPath);
  return parseJson(content);
};
