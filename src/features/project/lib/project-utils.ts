import { FileWithPath } from "@/features/project/types/file.types";
import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";

export async function parseJSONFile(
  file: FileWithPath
): Promise<Record<string, any>> {
  const json = parseJson(file.content);

  if (!json || typeof json !== "object")
    throw new Error("Invalid JSON content");

  return json;
}

export function flattenJson(
  obj: Record<string, string>,
  currentPath: string[] = []
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    const newPath = [...currentPath, key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenJson(value, newPath));
    } else {
      result[newPath.join(".")] = String(value ?? "");
    }
  }

  return result;
}

export function extractLanguageCode(filename: string): string | null {
  const nameWithoutExt = filename.replace(/\.(FrameworkType)$/i, "");

  const patterns = [
    /^([a-z]{2}(-[A-Z]{2})?)$/, // en, en-US
    /\.([a-z]{2}(-[A-Z]{2})?)$/, // messages.en.json
    /_([a-z]{2}(-[A-Z]{2})?)$/, // messages_en.json
  ];

  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export const readTranslationFile = async (
  rootDir: string,
  path: string
): Promise<Record<string, string>> => {
  const fullPath = `${rootDir}${path}`;
  const content = await readTextFile(fullPath);
  return parseJson(content) as Record<string, string>;
};
