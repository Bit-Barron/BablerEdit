import { Plus, Minus } from "lucide-react";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { createProject } from "@/features/translation";
import { useNavigate } from "react-router-dom";
import { ParsedProject } from "@/features/translation/types/parser.types";
import { useFileManagerStore } from "../store/file-manager.store";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    defaultLanguageCode,
    translationFiles,
    selectedFramework,
    setParsedProject,
  } = useFileManagerStore();
  const navigate = useNavigate();

  const parseProject = async () => {
    const project = await createProject(
      translationFiles,
      selectedFramework,
      defaultLanguageCode
    );

    if (!project) return;

    setParsedProject(project as ParsedProject);
    navigate("/editor");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 shrink-0">
          <DialogTitle className="text-lg font-semibold">
            Configure languages
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add or remove languages and their corresponding translation files:
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <section className="flex justify-center items-center">
            <FileUploadDropzone />
          </section>

          <div className="mt-2">
            <Button size="sm" variant="ghost">
              Primary Language: {defaultLanguageCode}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add language
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Minus className="h-4 w-4" />
              Remove language
            </Button>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button onClick={parseProject}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
