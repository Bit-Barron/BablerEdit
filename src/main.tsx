import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BrowserRouter } from "react-router-dom";

// Force WebView reflow on X11 where WebKit2GTK may not size the viewport correctly.
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.documentElement.style.overflow = "hidden";
    void document.documentElement.offsetHeight;
    window.dispatchEvent(new Event("resize"));
  });
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
