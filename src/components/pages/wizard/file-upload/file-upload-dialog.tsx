import { Plus, Minus } from "lucide-react";
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { MultiFileUpload } from "./kokonut-file-upload";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/lib/store/project.store";
import { FileWithPath } from "@/lib/types/file.types";
import { useWizardStore } from "@/lib/store/wizard.store";
import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/services/project.service";
import { useNotification } from "@/components/elements/glass-notification";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedFramework, setParsedProject } = useProjectStore();
  const { primaryLanguageCode } = useWizardStore();
  const [translationFiles, setTranslationFiles] = useState<FileWithPath[]>([]);
  const navigate = useNavigate();

  const parseProject = async () => {
    const project = await createProject(
      translationFiles,
      selectedFramework,
      primaryLanguageCode
    );

    if (!project) return;

    setParsedProject(project);
    navigate("/editor");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Content className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
          <h1 className="text-lg font-semibold">Configure languages</h1>
        </Dialog.Header>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
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

          <div className="flex justify-end mt-6 gap-2">
            <Button onClick={() => onOpenChange(false)} className="min-w-25">
              Close
            </Button>
            <Button onClick={parseProject}>Save</Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
