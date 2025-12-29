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
  const content = await readTextFile(fullPath);
  return parseJson(content) as Record<string, string>;
}

interface SelectJsonFilesResult {
  files: FileWithPath[];
}

export async function selectJsonFiles(): Promise<SelectJsonFilesResult | null> {
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
      const content = await readTextFile(path);
      const fileName = path.split(/[/\\]/).pop() || "";
      return {
        name: fileName,
        path: path,
        content: content,
        size: content.length,
      };
    })
  );

  return {
    files: filesWithPaths,
  };
}
