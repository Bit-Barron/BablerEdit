import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./core/components/providers/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
