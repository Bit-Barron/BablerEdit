"use client";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/wizzard";
import { EditorPage } from "../pages/editor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
}
