"use client";

import { WizardPage } from "@/pages/wizard-page";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { EditorPage } from "@/pages/editor-page";
import Toolbar from "@/core/components/layout/toolbar";
import MenuBar from "@/core/components/layout/menubar";
import { useEditorHook } from "@/features/editor/hooks/use-editor";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";

export default function App() {
  const { saveProject } = useEditorHook();
  const { parsedProject } = useFileManagerStore();

  return (
    <section>
      <MenuBar />
      <Toolbar actions={{ onSaveProject: () => saveProject(parsedProject) }} />

      <Routes>cl
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </section>
  );
}
