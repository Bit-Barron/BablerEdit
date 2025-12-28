import { Plus, Minus } from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/elements/alert-dialog";
import { MultiFileUpload } from "./file-upload";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/lib/store/project.store";
import { FileWithPath } from "@/lib/types/file.types";
import { Button } from "@/components/ui/retroui/button";
import * as ProjectService from "@/lib/services/project.service";

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
  const navigate = useNavigate();

  const parseProject = async () => {
    const project = await ProjectService.createProject({
      files: translationFiles,
      framework: selectedFramework!,
      primaryLanguage: primaryLanguageCode!,
    });

    if (!project) return;

    setProjectSnapshot(project.project);
    setParsedProject(project.project);
    navigate("/editor");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
        <AlertDialogHeader className="px-6 pt-6 pb-3 shrink-0">
          <AlertDialogTitle>Configure languages</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 pt-3 pb-6 overflow-y-auto flex-1">
          <section className="flex justify-center items-center">
            <MultiFileUpload
              files={translationFiles}
              onFilesChange={setTranslationFiles}
            />
          </section>

          <div className="mt-2">
            <Button size="sm" variant="ghost">
              Primary Language: {primaryLanguageCode}
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
        </div>

        <AlertDialogFooter className="px-6 pb-6 gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={parseProject}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
