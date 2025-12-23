import { useToolbarStore } from "@/core/store/toolbar.store";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { useProjectStore } from "@/features/project/stores/project.store";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { EditorPage } from "@/pages/editor-page";
import { WizardPage } from "@/pages/wizard-page";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import MenuBar from "@/core/components/layout/menubar/menubar";
import Toolbar from "@/core/components/layout/toolbar/toolbar";
import { useId } from "@/features/editor/hooks/use-id";

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
    <section>
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
    </section>
  );
}
