import { useCallback } from "react";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager-store";
import { FrameworkType } from "@/core/types/framework.types";

export const useWizardDialog = () => {
  const {
    setSelectedFramework,
    setFileUploadDialogOpen,
    isFileUploadDialogOpen,
  } = useFileManagerStore();

  const openFrameworkDialog = useCallback(
    (frameworkId: FrameworkType) => {
      setSelectedFramework(frameworkId);
      setFileUploadDialogOpen(true);
    },
    [setSelectedFramework, setFileUploadDialogOpen]
  );

  const closeDialog = useCallback(() => {
    setFileUploadDialogOpen(false);
  }, [setFileUploadDialogOpen]);

  return {
    isDialogOpen: isFileUploadDialogOpen,
    openFrameworkDialog,
    closeDialog,
  };
};
