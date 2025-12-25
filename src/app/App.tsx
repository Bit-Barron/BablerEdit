import { useToolbarStore } from "@/lib/store/toolbar.store";
import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/lib/store/project.store";
import { EditorPage } from "@/app/editor-page";
import { WizardPage } from "@/app/wizard-page";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MenuBar from "@/components/layout/menubar/menubar";
import Toolbar from "@/components/layout/toolbar/toolbar";
import { useId } from "@/hooks/use-id";
import { useSettings } from "@/hooks/use-settings";
import { Loader } from "@/components/elements/loader";
import {
  GlassNotificationProvider,
  useNotification,
} from "@/components/elements/glass-notification";

function AppContent() {
  const { onProjectClick, setOnProjectClick, setCurrentRoute } =
    useToolbarStore();
  const { parsedProject } = useProjectStore();
  const { saveProject, openProject } = useEditor();
  const { removeIdFromJson } = useId();
  const location = useLocation();
  const [openIdDialog, setOpenIdDialog] = useState(false);

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
          setOpenIdDialog(true);
          break;
        case "remove-ids":
          await removeIdFromJson();
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

  return (
    <>
      <MenuBar />
      <Toolbar />
      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route
          path="/editor"
          element={
            <EditorPage
              openIdDialog={openIdDialog}
              setOpenIdDialog={setOpenIdDialog}
            />
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  const { loading } = useSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size={100} />
      </div>
    );
  }

  return (
    <GlassNotificationProvider position="top-right">
      <AppContent />
    </GlassNotificationProvider>
  );
}
