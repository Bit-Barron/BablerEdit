import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import StatusIndicator from "@/components/elements/status-indicator";
import { MENUS } from "@/lib/config/menus.config";
import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useSettingsStore } from "@/lib/store/setting.store";
import { useEditor } from "@/hooks/use-editor";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/elements/toggles/mode-toggle";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";

export default function MenuBar() {
  const { hasUnsavedChanges, parsedProject, setParsedProject, setCurrentProjectPath, setHasUnsavedChanges, setFileUploadDialog } = useProjectStore();
  const { setPreTranslateDialog, setFilterDialogOpen, setConfigureLangDialogOpen, setAddIdDialogOpen, setCommandPaletteOpen } = useEditorStore();
  const { recentProjects } = useSettingsStore();
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
        setParsedProject({} as any);
        setCurrentProjectPath(null);
        setHasUnsavedChanges(false);
        navigate("/");
        break;
      case "saveProject":
        if (parsedProject && Object.keys(parsedProject).length > 0) {
          saveProject(parsedProject);
        }
        break;
      case "saveProjectAs":
        if (parsedProject && Object.keys(parsedProject).length > 0) {
          setCurrentProjectPath(null);
          saveProject(parsedProject);
        }
        break;
      case "import":
        setFileUploadDialog(true);
        break;
      case "quit":
        getCurrentWindow().close();
        break;

      // Edit
      case "undo":
        document.execCommand("undo");
        break;
      case "redo":
        document.execCommand("redo");
        break;
      case "cut":
        document.execCommand("cut");
        break;
      case "copy":
        document.execCommand("copy");
        break;
      case "paste":
        document.execCommand("paste");
        break;
      case "find":
      case "findTranslation":
        setCommandPaletteOpen(true);
        break;

      // View
      case "zoomIn":
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom || "1") + 0.1)}`;
        break;
      case "zoomOut":
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom || "1") - 0.1)}`;
        break;
      case "zoomReset":
        document.body.style.zoom = "1";
        break;

      // Tools
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

      // Window
      case "minimize":
        getCurrentWindow().minimize();
        break;
      case "zoomWindow":
        getCurrentWindow().toggleMaximize();
        break;

      default:
        break;
    }
  }, [parsedProject, navigate, openProject, saveProject, setParsedProject, setCurrentProjectPath, setHasUnsavedChanges, setPreTranslateDialog, setFilterDialogOpen, setConfigureLangDialogOpen, setAddIdDialogOpen, setCommandPaletteOpen, setFileUploadDialog]);

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

                  if (child.action === "openRecent" && recentProjects.length > 0) {
                    return (
                      <div key={child.label} className="relative group">
                        <div className="flex items-center justify-between px-3 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground">
                          <span>{child.label}</span>
                          <span className="ml-4 text-xs text-muted-foreground">▸</span>
                        </div>
                        <div className="absolute left-full top-0 hidden group-hover:block bg-popover border border-border rounded-md shadow-lg p-1 min-w-48">
                          {recentProjects.map((project) => (
                            <div
                              key={project.path}
                              onClick={() => {
                                // Recent project paths are stored but opening requires the full load flow
                                openProject();
                              }}
                              className="flex flex-col px-3 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                              <span>{project.name}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-60">{project.path}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
