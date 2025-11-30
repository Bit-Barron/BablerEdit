import { FrameworkDialog } from "@/features/files/components/files-language-config-dialog";
import { useFilesStore } from "@/features/files/store/file-store";
import "../app/App.css";
import { WizzardFrameworkTypes } from "@/features/wizzard/components/wizzard-framework-types";
import { WizzardRecentProjects } from "@/features/wizzard/components/wizzard-recent-projects";

export const WizzardPage: React.FC = () => {
  const { isFrameworkDialogOpen, setFrameworkDialogOpen } = useFilesStore();

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

          <WizzardFrameworkTypes />
          <WizzardRecentProjects />
        </div>
      </div>

      <FrameworkDialog
        onOpenChange={(isOpen) => setFrameworkDialogOpen(isOpen)}
        open={isFrameworkDialogOpen}
      />
    </div>
  );
};
