import { useFileManagerStore } from "@/features/file-manager/store/file-manager-store";
import "../app/App.css";
import { FileUploadDialog } from "@/features/file-manager/components/file-upload-dialog";
import { WizardFrameworkSelector } from "@/features/project-wizard/components/wizard-framework-selector";
import { WizardRecentProjects } from "@/features/project-wizard/components/wizard-recent-projects";

export const WizardPage: React.FC = () => {
  const { isFileUploadDialogOpen, setFileUploadDialogOpen } =
    useFileManagerStore();

  return (
    <div className="flex flex-col overflow-hidden bg-background">
      <div className="flex-1 bg-background p-6">
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

          <WizardFrameworkSelector />
          <WizardRecentProjects />
        </div>
      </div>

      <FileUploadDialog
        onOpenChange={(isOpen) => setFileUploadDialogOpen(isOpen)}
        open={isFileUploadDialogOpen}
      />
    </div>
  );
};
