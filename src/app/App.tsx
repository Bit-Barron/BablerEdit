"use client";

import { WizardPage } from "@/pages/wizard-page";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { EditorPage } from "@/pages/editor-page";
import Toolbar from "@/core/components/layout/toolbar";
import MenuBar from "@/core/components/layout/menubar";
import { useEditorHook } from "@/features/editor/hooks/use-editor";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { useSettingsPersistence } from "@/features/settings/hooks/use-settings";
import { useEffect } from "react";
import { useToolbarStore } from "@/core/store/toolbar-store";

export default function App() {
  const { saveProject, openProject } = useEditorHook();
  const { parsedProject } = useFileManagerStore();
  const location = useLocation();

  const { setCurrentPage } = useToolbarStore();

  useSettingsPersistence();

  useEffect(() => {
    if (location.pathname === "/editor") {
      setCurrentPage("editor");
    } else if (location.pathname === "/") {
      setCurrentPage("wizard");
    } else {
      setCurrentPage("save-project");
    }
  }, [location.pathname, setCurrentPage]);

  return (
    <section>
      <MenuBar />
      <Toolbar
        actions={{
          onSaveProject: () => saveProject(parsedProject),
          onOpenProject: () => openProject(),
        }}
      />

      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </section>
  );
}
