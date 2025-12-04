import MenuBar from "@/core/components/layout/menubar";
import Toolbar from "@/core/components/layout/toolbar";
import { useToolbarStore } from "@/core/store/toolbar-store";
import { useEditorHook } from "@/features/editor/hooks/editor-hook";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { useIdStore } from "@/features/id/store/id.store";
import { useSettingsHook } from "@/features/settings/hooks/use-settings";
import { EditorPage } from "@/pages/editor-page";
import { WizardPage } from "@/pages/wizard-page";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

export default function App() {
  const { onProjectClick, setOnProjectClick, setCurrentRoute } =
    useToolbarStore();
  const { saveProject, openProject } = useEditorHook();
  useSettingsHook();
  const { parsedProject } = useFileManagerStore();
  const { setOpenIdDialog } = useIdStore();
  const location = useLocation();

  useEffect(() => {
    if (onProjectClick === "save") {
      saveProject(parsedProject);
      setOnProjectClick!("");
    } else if (onProjectClick === "open") {
      openProject();
      setOnProjectClick!("");
    } else if (onProjectClick === "add-id") {
      setOpenIdDialog(true);
      setOnProjectClick!("");
    }
  }, [onProjectClick]);

  useEffect(() => {
    const currentRoute = location.pathname.split("/")[1] || "wizard";
    setCurrentRoute(currentRoute);
  }, [location.pathname]);

  return (
    <section>
      <MenuBar />
      <Toolbar />

      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </section>
  );
}
