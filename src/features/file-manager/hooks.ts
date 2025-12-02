import { useCallback, useMemo } from "react";
import { useFileManagerStore } from "./store/file-manager-store";
import { getFrameworkConfig } from "@/core/lib/frameworks";

export const useFileManagerHook = () => {
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

export const useSaveProject = () => {
  // if (!parsedProject) return;
  // const ymlStructure = {
  //   version: "1.3",
  //   be_version: "5.2.0",
  //   framework: parsedProject.framework,
  //   filename: "test.bable",
  //   source_root_dir: "../../",
  //   is_template_project: false,
  //   languages: {
  //     code: Array.from(parsedProject.languages.keys()),
  //   },
  //   translation_packages: {
  //     name: "main",
  //     translation_urls: {
  //       path: Array.from(parsedProject.languages.keys()),
  //       language: Array.from(parsedProject.languages.keys()),
  //     },
  //   },
  //   editor_configuration: {
  //     save_empty_translations: true,
  //     translation_order: "alphabetically",
  //   },
  //   primary_language: parsedProject.primary_language,
  //   folder_structure: {
  //     name: "",
  //     children: {
  //       type: "package",
  //       name: "main",
  //       children: Array.from(parsedProject.languages),
  //     },
  //   },
  // };
  // return ymlStructure;
};
