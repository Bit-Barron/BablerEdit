"use client";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { EditorPage } from "../pages/editor";
import { WizzardPage } from "@/pages/wizzard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WizzardPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
}
