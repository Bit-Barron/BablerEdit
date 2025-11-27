import { FrameworkDialog } from "@/features/files/components/language-config-dialog";
import { useFilesStore } from "@/features/files/store/file-store";
import { WelcomeFrameworkTypes } from "@/features/welcome/components/welcome-framework-types";
import { WelcomeRecentProjects } from "@/features/welcome/components/welcome-recent-projects";
import "../App.css";

export default function WelcomePage() {
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

          <WelcomeFrameworkTypes />
          <WelcomeRecentProjects />
        </div>
      </div>

      <FrameworkDialog
        onOpenChange={(isOpen) => setFrameworkDialogOpen(isOpen)}
        open={isFrameworkDialogOpen}
      />
    </div>
  );
}
