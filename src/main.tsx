import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "./shared/components/providers/theme-provider";
import MenuBar from "./shared/components/layout/os-menubar";
import Toolbar from "./shared/components/layout/tool-menubarbar";
import { HashRouter } from "react-router-dom";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster richColors />
      <MenuBar />
      <Toolbar />
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
