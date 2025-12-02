import { useCallback, useMemo } from "react";
import { getFrameworkConfig } from "@/core/config/frameworks.config";
import { useFileManagerStore } from "../store/file-manager.store";

export const useFileManager = () => {
  const {
    translationFiles,
    removeTranslationFile,
    validateAndAddFiles,
    selectedFramework,
    onFileReject,
    parsedProject,
  } = useFileManagerStore();

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
    parsedProject,
  };
};
