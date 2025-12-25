import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { FileWithPath } from "@/lib/types/file.types";

export const useFileManager = () => {
  const selectJsonFiles = async (): Promise<FileWithPath[] | null> => {
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

      toast.success(`Loaded ${filesWithPaths.length} files successfully`);
      return filesWithPaths;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);
      return null;
    }
  };

  return {
    selectJsonFiles,
  };
};
