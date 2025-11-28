"use client";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcome-page";
import { EditorPage } from "./pages/editor-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
}
