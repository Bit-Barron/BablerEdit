import { FileWithPath } from "@/features/project/types/file.types";
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
