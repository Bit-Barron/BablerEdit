import "@/app/App.css";
import { useState, useEffect } from "react";
import { WizardFrameworkSelector } from "@/components/pages/wizard/framework-selector";
import { WizardRecentProjects } from "@/components/pages/wizard/recent-projects";
import { FileUploadDialog } from "@/components/pages/wizard/file-upload/file-upload-dialog";
import { useProjectStore } from "@/lib/store/project.store";
import { useTranslationStore } from "@/lib/store/translation.store";
import { FileWithPath } from "@/lib/types/project.types";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const WizardPage: React.FC = () => {
  const { fileUploadDialog, setFileUploadDialog } = useProjectStore();
  const { setTranslationFiles } = useTranslationStore();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setup = async () => {
      try {
        unlisten = await getCurrentWindow().onDragDropEvent(async (event) => {
          if (event.payload.type === "over" || event.payload.type === "enter") {
            setIsDragging(true);
          } else if (event.payload.type === "leave") {
            setIsDragging(false);
          } else if (event.payload.type === "drop") {
            setIsDragging(false);

            const droppedPaths = event.payload.paths;
            const jsonFiles = droppedPaths.filter((p) => p.endsWith(".json"));

            if (jsonFiles.length === 0) return;

            const filesWithPath: FileWithPath[] = await Promise.all(
              jsonFiles.map(async (filePath) => {
                const content = await readTextFile(filePath);
                const fileName = filePath.split(/[/\\]/).pop() || "";
                return {
                  name: fileName,
                  path: filePath,
                  content,
                  size: content.length,
                };
              })
            );

            setTranslationFiles(filesWithPath);
            setFileUploadDialog(true);
          }
        });
      } catch (err) {
        console.error("Error setting up drag drop listener:", err);
      }
    };

    setup();

    return () => {
      if (unlisten) unlisten();
    };
  }, [setFileUploadDialog, setTranslationFiles]);

  return (
    <div
      className="flex flex-col overflow-hidden h-full"
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
