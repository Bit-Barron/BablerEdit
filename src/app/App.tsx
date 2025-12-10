import MenuBar from "@/core/components/layout/menubar";
import Toolbar from "@/core/components/layout/toolbar";
import { useToolbarStore } from "@/core/store/toolbar.store";
import { useEditorHook } from "@/features/editor/hooks/editor.hook";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { useIdHook } from "@/features/id/hooks/id.hook";
import { useIdStore } from "@/features/id/store/id.store";
import { useSettingsHook } from "@/features/settings/hooks/settings.hook";
import { EditorPage } from "@/pages/editor-page";
import { WizardPage } from "@/pages/wizard-page";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  const { onProjectClick, setOnProjectClick, setCurrentRoute } =
    useToolbarStore();
  const { saveProject, openProject } = useEditorHook();
  const { parsedProject } = useFileManagerStore();
  const { setOpenIdDialog } = useIdStore();
  const { removeIdFromJson } = useIdHook();
  const location = useLocation();

  useSettingsHook();

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
      <Toaster position="top-right" richColors closeButton duration={4000} />
      <MenuBar />
      <Toolbar />
      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </section>
  );
}
