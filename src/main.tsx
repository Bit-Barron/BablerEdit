import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { HashRouter } from "react-router-dom";
import { Toaster } from "sonner";
import MenuBar from "./core/components/layout/menubar";
import Toolbar from "./core/components/layout/toolbar";
import { ThemeProvider } from "./core/components/providers/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster richColors position="top-right" />
      <MenuBar />
      <Toolbar />
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
