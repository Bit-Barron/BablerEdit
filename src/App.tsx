"use client";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcome-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
    </Routes>
  );
}
