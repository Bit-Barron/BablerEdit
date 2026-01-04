import { useEditorStore } from "@/lib/store/editor.store";
import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/lib/store/project.store";
import { EditorPage } from "@/components/pages/editor-page";
import { WizardPage } from "@/components/pages/wizard-page";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MenuBar from "@/components/layout/menubar/menubar";
import Toolbar from "@/components/layout/toolbar/toolbar";
import { useSettings } from "@/hooks/use-settings";
import { Loader } from "@/components/elements/loader";
import { GlassNotificationProvider } from "@/components/elements/toast-notification";
import { useTranslation } from "@/hooks/use-translation";
import { useShortcut } from "@/hooks/use-shortcut";
import { ErrorBoundary } from "@/components/error-boundary";

function AppContent() {
  const {
    onProjectClick,
    setOnProjectClick,
    setCurrentRoute,
    setAddIdDialogOpen,
    setConfigureLangDialogOpen,
    setFilterDialogOpen,
    setPreTranslateDialog
  } = useEditorStore();
  const { parsedProject } = useProjectStore();
  const { saveProject, openProject } = useEditor();
  const { removeIdFromJson } = useTranslation();
  const location = useLocation();
  const { loading } = useSettings();

  useShortcut();
  useEffect(() => {
    const handleToolbarAction = async () => {
      switch (onProjectClick) {
        case "save":
          if (parsedProject) {
            await saveProject(parsedProject);
          }
          break;
        case "open":
          await openProject();
          break;
        case "add-id":
          setAddIdDialogOpen(true);
          break;
        case "pre-translate":
          setPreTranslateDialog(true)

          break
        case "remove-ids":
          await removeIdFromJson();
          break;
        case "filter":
          setFilterDialogOpen(true)
          break;
        case "languages":
          setConfigureLangDialogOpen(true);
          break;
        default:
          break;
      }

      if (onProjectClick) {
        setOnProjectClick("");
      }
    };

    handleToolbarAction();
  }, [onProjectClick]);

  useEffect(() => {
    const currentRoute = location.pathname.split("/")[1] || "wizard";
    setCurrentRoute(currentRoute);
  }, [location.pathname, setCurrentRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <MenuBar />
      <Toolbar />
      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlassNotificationProvider position="top-right">
        <AppContent />
      </GlassNotificationProvider>
    </ErrorBoundary>
  );
}
