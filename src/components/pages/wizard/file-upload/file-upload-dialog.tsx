import { Plus, Minus } from "lucide-react";
import React, { useState } from "react";
import { Dialog } from "@/components/ui/retroui/dialog";
import { MultiFileUpload } from "./file-upload";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/lib/store/project.store";
import { FileWithPath } from "@/lib/types/project.types";
import { Button } from "@/components/ui/retroui/button";
import * as ProjectService from "@/lib/services/project.service";
import { useNotification } from "@/components/elements/toast-notification";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    selectedFramework,
    setParsedProject,
    setProjectSnapshot,
    primaryLanguageCode,
  } = useProjectStore();
  const [translationFiles, setTranslationFiles] = useState<FileWithPath[]>([]);
  const [dialogOpen, setDialogOpen] = useState(open);
  const { addNotification } = useNotification();

  React.useEffect(() => {
    setDialogOpen(open);
  }, [open]);
  const navigate = useNavigate();

  const parseProject = async () => {
    try {
      if (translationFiles.length === 0) {
        addNotification({
          type: "warning",
          title: "No files selected",
          description: "Please upload at least one translation file.",
        });
        return;
      }

      const project = await ProjectService.createProject({
        files: translationFiles,
        framework: selectedFramework!,
        primaryLanguage: primaryLanguageCode!,
      });

      if (!project) return;

      setProjectSnapshot(project.project);
      setParsedProject(project.project);

      addNotification({
        type: "success",
        title: "Project created",
        description: "Project has been created successfully.",
      });

      navigate("/editor");
      setDialogOpen(false);
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating project:", err);
      addNotification({
        type: "error",
        title: "Failed to create project",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(v) => {
        setDialogOpen(v);
        onOpenChange(v);
      }}
    >
      <Dialog.Content size="md">
        <Dialog.Header className="px-4 pt-4 pb-2 shrink-0 ">
          Configure languages
        </Dialog.Header>

        <div className="px-4 pt-2 pb-4 overflow-y-auto flex-1 min-h-0 bg-background">
          <section className="flex justify-center items-center">
            <MultiFileUpload
              files={translationFiles}
              onFilesChange={setTranslationFiles}
            />
          </section>

          <div className="mt-1.5">
            <Button size="sm" variant="ghost">
              Primary Language: {primaryLanguageCode}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add language
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Minus className="h-4 w-4" />
              Remove language
            </Button>
          </div>
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={parseProject}>Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
