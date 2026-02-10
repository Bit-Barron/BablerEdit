import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import StatusIndicator from "@/components/elements/status-indicator";
import { MENUS } from "@/lib/config/menus.config";
import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useEditor } from "@/hooks/use-editor";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/elements/toggles/mode-toggle";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";

export default function MenuBar() {
  const { hasUnsavedChanges, parsedProject, setParsedProject, setCurrentProjectPath, setHasUnsavedChanges, setFileUploadDialog } = useProjectStore();
  const { setPreTranslateDialog, setFilterDialogOpen, setConfigureLangDialogOpen, setAddIdDialogOpen, setCommandPaletteOpen, setStatisticsDialogOpen, setConsistencyDialogOpen, setApiKeysDialogOpen, toggleToolbar } = useEditorStore();
  const { saveProject, openProject } = useEditor();
  const navigate = useNavigate();

  const handleAction = useCallback((action?: string) => {
    if (!action) return;

    switch (action) {
      case "newProject":
        navigate("/");
        break;
      case "openProject":
        openProject();
        break;
      case "closeProject":
        // WORKING!!!!
        navigate("/");
        break;
      case "saveProject":
        // WORKING!!!!
        saveProject(parsedProject);
        break;
      case "quit":
        getCurrentWindow().close();
        break;

      case "findTranslation":
        setCommandPaletteOpen(true);
        break;
      case "toggleToolbar":
        toggleToolbar();
        break;

      case "zoomIn":
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom || "1") + 0.1)}`;
        break;
      case "zoomOut":
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom || "1") - 0.1)}`;
        break;
      case "zoomReset":
        document.body.style.zoom = "1";
        break;

      case "preTranslate":
        setPreTranslateDialog(true);
        break;
      case "configureLang":
        setConfigureLangDialogOpen(true);
        break;
      case "addId":
        setAddIdDialogOpen(true);
        break;
      case "filter":
        setFilterDialogOpen(true);
        break;

      case "exportCsv":
        if (parsedProject) {
          import("@/lib/services/export.service").then(({ exportProjectToCsv }) => {
            exportProjectToCsv(parsedProject);
          });
        }
        break;
      case "importCsv":
        if (parsedProject) {
          import("@/lib/services/export.service").then(async ({ importCsvToProject }) => {
            const result = await importCsvToProject(parsedProject);
            if (result) setParsedProject(result);
          });
        }
        break;
      case "statistics":
        setStatisticsDialogOpen(true);
        break;
      case "consistencyCheck":
        setConsistencyDialogOpen(true);
        break;
      case "machineTranslation":
        setPreTranslateDialog(true);
        break;
      case "validateTranslations":
        setConsistencyDialogOpen(true);
        break;
      case "apiKeys":
        setApiKeysDialogOpen(true);
        break;
      case "openSettings":
        navigate("/settings");
        break;
      case "minimize":
        getCurrentWindow().minimize();
        break;
      case "zoomWindow":
        getCurrentWindow().toggleMaximize();
        break;

      default:
        break;
    }
  }, [parsedProject, navigate, openProject, saveProject, setParsedProject, setCurrentProjectPath, setHasUnsavedChanges, setPreTranslateDialog, setFilterDialogOpen, setConfigureLangDialogOpen, setAddIdDialogOpen, setCommandPaletteOpen, setFileUploadDialog, toggleToolbar]);

  return (
    <div className="w-full bg-secondary border-b border-border-subtle flex items-center justify-between">
      <NavigationMenu className="relative z-50">
        <NavigationMenuList>
          {MENUS.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger className="bg-secondary">
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-popover border border-border rounded-md shadow-lg p-1 min-w-50">
                {item.items.map((child, index) => {
                  if (child.divider) {
                    return (
                      <div
                        key={index}
                        className="h-px bg-secondary my-1 mx-2"
                      />
                    );
                  }
                  return (
                    <div
                      key={child.label}
                      onClick={() => handleAction(child.action)}
                      className="flex items-center justify-between px-3 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      <span>{child.label}</span>
                      {child.shortcut && (
                        <span className="ml-8 text-xs text-muted-foreground">
                          {child.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="pr-4 flex space-x-2">
        {hasUnsavedChanges && (
          <StatusIndicator state="down" label="Has unsaved changes" />
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
