import { useToolbarStore } from "@/stores/toolbar.store";
import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/stores/project.store";
import { EditorPage } from "@/pages/editor-page";
import { WizardPage } from "@/pages/wizard-page";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import MenuBar from "@/components/layout/menubar/menubar";
import Toolbar from "@/components/layout/toolbar/toolbar";
import { useId } from "@/hooks/use-id";
import Aurora from "@/components/elements/Aurora";
import { useSettings } from "@/hooks/use-settings";

export default function App() {
  const { onProjectClick, setOnProjectClick, setCurrentRoute } =
    useToolbarStore();
  const { parsedProject } = useProjectStore();
  const { saveProject, openProject } = useEditor();
  const { removeIdFromJson } = useId();
  const location = useLocation();
  const [openIdDialog, setOpenIdDialog] = useState(false);

  useSettings();

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
      <div className="fixed inset-0 -z-10 bg-black">
        <Aurora
          colorStops={["#1a1a3e", "#3b82f6", "#8b5cf6"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.3}
        />
      </div>

      <Toaster position="top-right" theme="dark" closeButton duration={4000} />
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
