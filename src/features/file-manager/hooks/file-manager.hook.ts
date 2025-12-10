import { useFileManagerStore } from "../store/file-manager.store";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";

export const useFileManagerHook = () => {
  const { translationFiles, parsedProject, setTranslationFiles } =
    useFileManagerStore();

  const handleJsonFiles = async () => {
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

      if (!selected) return;

      const filesWithPaths = await Promise.all(
        selected.map(async (path) => {
          const content = await readTextFile(path);
          const fileName = path.split(/[/\\]/).pop() || ""; // en.json, C:\path\to\file\en.json
          return {
            name: fileName,
            path: path,
            content: content,
            size: content.length,
          };
        })
      );

      toast.success(`Loaded ${filesWithPaths.length} files successfully`);
      setTranslationFiles(filesWithPaths);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);

      return null;
    }
  };

  return {
    translationFiles,
    parsedProject,
    handleJsonFiles,
  };
};
