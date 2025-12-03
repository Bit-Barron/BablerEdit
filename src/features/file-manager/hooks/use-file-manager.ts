import { useMemo } from "react";
import { getFrameworkConfig } from "@/core/config/frameworks.config";
import { useFileManagerStore } from "../store/file-manager.store";

export const useFileManager = () => {
  const { translationFiles, selectedFramework, onFileReject, parsedProject } =
    useFileManagerStore();

  const config = useMemo(() => {
    return selectedFramework ? getFrameworkConfig(selectedFramework) : null;
  }, [selectedFramework]);

  const acceptedTypes = config?.acceptedExtensions.join(",") ?? "";
  const maxSizeInMB = config ? config.maxSize / 1024 / 1024 : 0;

  return {
    config,
    translationFiles,
    acceptedTypes,
    maxSizeInMB,
    onFileReject,
    parsedProject,
  };
};
