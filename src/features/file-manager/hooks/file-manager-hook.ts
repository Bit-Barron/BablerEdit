import { useFileManagerStore } from "../store/file-manager.store";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const useFileManagerHook = () => {
  const { translationFiles, parsedProject, setTranslationFiles } =
    useFileManagerStore();

  const handleJsonFiles = async () => {
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
        const fileName = path.split("/").pop() || path.split("\\").pop() || "";

        return {
          name: fileName,
          path: path,
          content: content,
          size: content.length,
        };
      })
    );

    setTranslationFiles(filesWithPaths);
  };

  return {
    translationFiles,
    parsedProject,
    handleJsonFiles,
  };
};
