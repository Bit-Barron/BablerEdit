import { useEditorStore } from "@/lib/store/editor.store";
import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/lib/store/project.store";
import { EditorPage } from "@/components/pages/editor-page";
import { WizardPage } from "@/components/pages/wizard-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { ShortcutsPage } from "@/components/pages/shortcuts-page";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MenuBar from "@/components/layout/menubar/menubar";
import Toolbar from "@/components/layout/toolbar/toolbar";
import { useSettings } from "@/hooks/use-settings";
import { Loader } from "@/components/elements/loader";
import { GlassNotificationProvider } from "@/components/elements/toast-notification";
import { useTranslation } from "@/hooks/use-translation";
import { useShortcut } from "@/hooks/use-shortcut";
import { ErrorBoundary } from "@/components/error-boundary";
import { useSettingsStore } from "@/lib/store/setting.store";
import {
  COLOR_SCHEMES,
  BORDER_RADIUS_OPTIONS,
  FONT_OPTIONS,
} from "@/lib/config/design.config";

function AppContent() {
  const {
    onProjectClick,
    setOnProjectClick,
    setCurrentRoute,
    setAddIdDialogOpen,
    setConfigureLangDialogOpen,
    setFilterDialogOpen,
    setPreTranslateDialog,
    toolbarVisible,
    setCommandPaletteOpen,
    setRenameDialogOpen,
    toggleToolbar,
    setConsistencyDialogOpen,
  } = useEditorStore();
  const { parsedProject } = useProjectStore();
  const { saveProject, openProject } = useEditor();
  const { removeIdFromJson, duplicateId, pasteId } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useSettings();

  const shortcutActions = useMemo(
    () => ({
      newProject: () => navigate("/"),
      openProject: () => openProject(),
      saveProject: () => {
        const project = useProjectStore.getState().parsedProject;
        if (project && Object.keys(project).length > 0) {
          saveProject(project);
        }
      },
      closeProject: () => navigate("/"),
      findTranslation: () => setCommandPaletteOpen(true),
      addId: () => setAddIdDialogOpen(true),
      deleteSelected: () => {
        const { selectedNode: node } = useEditorStore.getState();
        if (node) removeIdFromJson();
      },
      rename: () => {
        const { selectedNode: node } = useEditorStore.getState();
        if (node?.isLeaf) setRenameDialogOpen(true);
      },
      cut: () => {
        const { selectedNodes, addClipboardNode } = useEditorStore.getState();
        selectedNodes.forEach(node => {
          if (node.isLeaf) {
            addClipboardNode({ id: node.data.id, mode: "cut" });
          }
        });
      },
      copy: () => {
        const { selectedNodes, addClipboardNode } = useEditorStore.getState();
        selectedNodes.forEach(node => {
          if (node.isLeaf) {
            addClipboardNode({ id: node.data.id, mode: "copy" });
          }
        });
      },
      paste: async () => {
        const { clipboardNodes, selectedNode: node, clearClipboard } = useEditorStore.getState();
        if (!clipboardNodes.length) return;
        let targetParentId: string | null = null;
        if (node) {
          if (node.isLeaf) {
            const parts = node.data.id.split(".");
            targetParentId = parts.length > 1 ? parts.slice(0, -1).join(".") : null;
          } else {
            targetParentId = node.data.id;
          }
        }
        const items = [...clipboardNodes];
        clearClipboard();
        let currentProject = parsedProject;
        for (const item of items) {
          const result = await pasteId(item.id, targetParentId, item.mode, currentProject);
          if (result) {
            currentProject = result;
          }
        }
      },
      duplicate: () => {
        const { selectedNode: node } = useEditorStore.getState();
        if (node?.isLeaf) duplicateId(node.data.id);
      },
      copyId: () => {
        const { selectedNode: node } = useEditorStore.getState();
        if (node) navigator.clipboard.writeText(node.data.id);
      },
      copyIdQuoted: () => {
        const { selectedNode: node } = useEditorStore.getState();
        if (node) navigator.clipboard.writeText(`'${node.data.id}'`);
      },
      zoomIn: () => {
        document.body.style.zoom = `${parseFloat(document.body.style.zoom || "1") + 0.1}`;
      },
      zoomOut: () => {
        document.body.style.zoom = `${parseFloat(document.body.style.zoom || "1") - 0.1}`;
      },
      zoomReset: () => {
        document.body.style.zoom = "1";
      },
      toggleToolbar: () => toggleToolbar(),
      preTranslate: () => setPreTranslateDialog(true),
      openSettings: () => navigate("/settings"),
    }),
    [
      navigate,
      openProject,
      saveProject,
      removeIdFromJson,
      duplicateId,
      pasteId,
      setCommandPaletteOpen,
      setAddIdDialogOpen,
      setRenameDialogOpen,
      setPreTranslateDialog,
      toggleToolbar,
    ]
  );

  useShortcut(shortcutActions);

  const { designSettings } = useSettingsStore();

  // Apply design settings as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const scheme = COLOR_SCHEMES.find((s) => s.id === designSettings.colorScheme);
    if (scheme) {
      root.style.setProperty("--primary", scheme.primary);
      root.style.setProperty("--primary-hover", scheme.primaryHover);
      root.style.setProperty("--primary-foreground", scheme.primaryForeground);
      root.style.setProperty("--accent", scheme.accent);
      root.style.setProperty("--accent-foreground", scheme.accentForeground);
      const isDark = root.classList.contains("dark");
      root.style.setProperty("--ring", isDark ? scheme.ringDark : scheme.ring);
      // Update sidebar colors to match
      root.style.setProperty("--sidebar-primary", scheme.primary);
      root.style.setProperty("--sidebar-primary-foreground", scheme.primaryForeground);
      root.style.setProperty("--sidebar-accent", scheme.accent);
      root.style.setProperty("--sidebar-accent-foreground", scheme.accentForeground);
    }
    const radius = BORDER_RADIUS_OPTIONS.find((r) => r.id === designSettings.borderRadius);
    if (radius) {
      root.style.setProperty("--radius", radius.value);
    }
    const font = FONT_OPTIONS.find((f) => f.id === designSettings.font);
    if (font) {
      root.style.setProperty("--font-head", font.fontHead);
      root.style.setProperty("--font-sans", font.fontSans);
    }
  }, [designSettings]);

  useEffect(() => {
    const handleToolbarAction = async () => {
      switch (onProjectClick) {
        case "save":
          if (parsedProject) {
            await saveProject(parsedProject);
          }
          break;
        case "open":
          await openProject();
          break;
        case "add-id":
          setAddIdDialogOpen(true);
          break;
        case "pre-translate":
          setPreTranslateDialog(true);
          break;
        case "remove-ids":
          await removeIdFromJson();
          break;
        case "filter":
          setFilterDialogOpen(true);
          break;
        case "languages":
          setConfigureLangDialogOpen(true);
          break;
        case "consistency-check":
          setConsistencyDialogOpen(true);
          break;
        default:
          break;
      }

      if (onProjectClick) {
        setOnProjectClick("");
      }
    };

    handleToolbarAction();
  }, [onProjectClick]);

  useEffect(() => {
    const currentRoute = location.pathname.split("/")[1] || "wizard";
    setCurrentRoute(currentRoute);
  }, [location.pathname, setCurrentRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <MenuBar />
      {toolbarVisible && <Toolbar />}
      <Routes>
        <Route path="/" element={<WizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/shortcuts" element={<ShortcutsPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlassNotificationProvider position="top-right">
        <AppContent />
      </GlassNotificationProvider>
    </ErrorBoundary>
  );
}
