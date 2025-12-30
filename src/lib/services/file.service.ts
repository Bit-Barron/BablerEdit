import { FileWithPath } from "@/lib/types/project.types";
import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";
import { open } from "@tauri-apps/plugin-dialog";

interface ReadTranslationFileParams {
  rootDir: string;
  path: string;
}

export async function readTranslationFile(params: ReadTranslationFileParams) {
  const { path, rootDir } = params;
  const fullPath = `${rootDir}${path}`;

  try {
    const content = await readTextFile(fullPath);
    return parseJson(content) as Record<string, string>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to read or parse translation file at "${fullPath}": ${error.message}`
      );
    }
    throw new Error(`Failed to read or parse translation file at "${fullPath}"`);
  }
}

interface SelectJsonFilesResult {
  files: FileWithPath[];
}

export async function selectJsonFiles(): Promise<SelectJsonFilesResult | null> {
  try {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: "Translation Files",
          extensions: ["json"],
        },
      ],
    });

    if (!selected) return null;

    const filesWithPaths = await Promise.all(
      selected.map(async (path) => {
        try {
          const content = await readTextFile(path);
          const fileName = path.split(/[/\\]/).pop() || "";
          return {
            name: fileName,
            path: path,
            content: content,
            size: content.length,
          };
        } catch (error) {
          throw new Error(
            `Failed to read file "${path}": ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      })
    );

    return {
      files: filesWithPaths,
    };
  } catch (error) {
    console.error("Error selecting JSON files:", error);
    throw error;
  }
}
