import "@/app/App.css";
import { useState, useCallback } from "react";
import { WizardFrameworkSelector } from "@/components/pages/wizard/framework-selector";
import { WizardRecentProjects } from "@/components/pages/wizard/recent-projects";
import { FileUploadDialog } from "@/components/pages/wizard/file-upload/file-upload-dialog";
import { useProjectStore } from "@/lib/store/project.store";
import { useTranslationStore } from "@/lib/store/translation.store";
import { FileWithPath } from "@/lib/types/project.types";

export const WizardPage: React.FC = () => {
  const { fileUploadDialog, setFileUploadDialog } = useProjectStore();
  const { setTranslationFiles } = useTranslationStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        return ext === "json";
      });

      if (validFiles.length === 0) return;

      const filesWithPath: FileWithPath[] = await Promise.all(
        validFiles.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            path: file.name,
            content,
            size: file.size,
          };
        })
      );

      setTranslationFiles(filesWithPath);
      setFileUploadDialog(true);
    },
    [setFileUploadDialog, setTranslationFiles]
  );

  return (
    <div
      className="flex flex-col overflow-hidden h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 border-4 border-dashed border-primary rounded-lg m-4 pointer-events-none">
          <div className="text-2xl font-bold text-primary">
            Drop translation files here
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <header className="mb-4">
            <h1 className="mb-1 text-[22px] font-semibold text-primary">
              Create a new translation project:
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Please select the used framework or
              <span className="font-medium text-primary ml-1 mr-1">
                drop your language files
              </span>
              here.
            </p>
          </header>

          <WizardFrameworkSelector
            onSelect={() => setFileUploadDialog(true)}
          />
          <WizardRecentProjects />
        </div>
      </div>

      <FileUploadDialog
        onOpenChange={setFileUploadDialog}
        open={fileUploadDialog}
      />
    </div>
  );
};
