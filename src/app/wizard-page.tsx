import { useState } from "react";
import "../app/App.css";
import { WizardFrameworkSelector } from "@/components/pages/wizard/framework-selector";
import { WizardRecentProjects } from "@/components/pages/wizard/recent-projects";
import { FileUploadDialog } from "@/components/pages/wizard/file-upload/file-upload-dialog";

export const WizardPage: React.FC = () => {
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden">
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

          <WizardFrameworkSelector onSelect={() => setFileUploadDialogOpen(true)} />
          <WizardRecentProjects />
        </div>
      </div>

      <FileUploadDialog
        onOpenChange={setFileUploadDialogOpen}
        open={isFileUploadDialogOpen}
      />
    </div>
  );
};
