"use client";

import { WizardPage } from "@/pages/wizard-page";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { EditorPage } from "@/pages/editor-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WizardPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
}
