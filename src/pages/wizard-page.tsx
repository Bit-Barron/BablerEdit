import { useProjectStore } from "@/features/project/store/project.store";
import "../app/App.css";
import { WizardFrameworkSelector } from "@/features/wizard/components/framework-selector";
import { WizardRecentProjects } from "@/features/wizard/components/recent-projects";
import { FileUploadDialog } from "@/features/wizard/components/file-upload-dialog";

export const WizardPage: React.FC = () => {
  const { isFileUploadDialogOpen, setFileUploadDialogOpen } =
    useProjectStore();

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
