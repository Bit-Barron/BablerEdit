import { FileWithPath } from "@/lib/types/project.types";
import parseJson from "parse-json";

export async function parseJSONFile(
  file: FileWithPath
): Promise<Record<string, any>> {
  const json = parseJson(file.content);

  if (!json || typeof json !== "object")
    throw new Error("Invalid JSON content");

  return json;
}
