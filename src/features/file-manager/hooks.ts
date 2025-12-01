import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "./store/file-manager-store";
import { getFrameworkConfig } from "@/core/lib/frameworks";
import { useEditorPageStore } from "../editor/store/editor-store";
import { toast } from "sonner";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { generateTranslationFiles } from "./lib/translation-file-generator";
import { generateBablerProject } from "./lib/babler-generator";

export const useFileManagerHook = () => {
  const {
    translationFiles,
    removeTranslationFile,
    validateAndAddFiles,
    selectedFramework,
    onFileReject,
    parsedProject,
  } = useFileManagerStore();

  const navigate = useNavigate();
  const { parseFiles } = useFileManagerStore();

  const parseAndNavigate = useCallback(async () => {
    await parseFiles();
    navigate("/editor");
  }, [parseFiles, navigate]);

  const config = useMemo(() => {
    return selectedFramework ? getFrameworkConfig(selectedFramework) : null;
  }, [selectedFramework]);

  const handleFilesChange = useCallback(
    async (files: File[]) => {
      const hasNewFiles = files.length > translationFiles.length;
      if (hasNewFiles) {
        await validateAndAddFiles(files);
      }
    },
    [translationFiles.length, validateAndAddFiles]
  );

  const handleFileDelete = useCallback(
    (file: File) => (e: React.MouseEvent) => {
      e.preventDefault();
      removeTranslationFile(file);
    },
    [removeTranslationFile]
  );

  const acceptedTypes = config?.acceptedExtensions.join(",") ?? "";
  const maxSizeInMB = config ? config.maxSize / 1024 / 1024 : 0;

  return {
    config,
    translationFiles,
    acceptedTypes,
    maxSizeInMB,
    handleFilesChange,
    handleFileDelete,
    onFileReject,
    parseAndNavigate,
    parsedProject,
  };
};
export const useSaveProject = () => {
  const { parsedProject } = useFileManagerStore();
  const { editTranslations, setDirty } = useEditorPageStore();

  const saveProject = useCallback(async () => {
    if (!parsedProject) {
      toast.error("No project to save");
      return;
    }

    try {
      // Let user select where to save
      const bablerPath = await save({
        filters: [
          {
            name: "Babler Project",
            extensions: ["babler"],
          },
        ],
        defaultPath: "project.babler",
      });

      if (!bablerPath) {
        return; // User cancelled
      }

      const filename = bablerPath.split("/").pop() || "project.babler";
      const bablerProject = generateBablerProject(
        parsedProject,
        filename,
        editTranslations
      );

      await writeTextFile(bablerPath, JSON.stringify(bablerProject, null, 2));

      const translationFiles = generateTranslationFiles(
        parsedProject,
        editTranslations
      );

      const projectDir = bablerPath.substring(0, bablerPath.lastIndexOf("/"));

      const savePromises = Array.from(translationFiles.entries()).map(
        async ([filename, content]) => {
          const filePath = `${projectDir}/${filename}`;
          await writeTextFile(filePath, content);
        }
      );

      await Promise.all(savePromises);

      setDirty(false);

      toast.success("Project saved successfully!", {
        description: `Saved ${translationFiles.size + 1} files`,
      });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save project", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [parsedProject, editTranslations, setDirty]);

  return { saveProject };
};