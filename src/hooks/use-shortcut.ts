import { register, unregister, isRegistered } from "@tauri-apps/plugin-global-shortcut";
import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/lib/store/project.store";
import { useEffect, useRef } from "react";

let globalShortcutRegistered = false;

export const useShortcut = () => {
  const { saveProject } = useEditor();
  const { parsedProject } = useProjectStore();
  const saveProjectRef = useRef(saveProject);
  const parsedProjectRef = useRef(parsedProject);

  useEffect(() => {
    saveProjectRef.current = saveProject;
    parsedProjectRef.current = parsedProject;
  });

  useEffect(() => {
    const setupShortcut = async () => {
      if (globalShortcutRegistered) {
        console.log("Shortcut already registered globally, skipping");
        return;
      }

      try {
        const alreadyRegistered = await isRegistered("CommandOrControl+S");

        if (alreadyRegistered) {
          console.log("Shortcut already registered in Tauri, unregistering first");
          await unregister("CommandOrControl+S");
        }

        await register("CommandOrControl+S", async () => {
          console.log("Ctrl+S pressed!");
          const currentProject = parsedProjectRef.current;
          const currentSaveProject = saveProjectRef.current;

          if (currentProject && Object.keys(currentProject).length > 0) {
            console.log("Saving project...");
            await currentSaveProject(currentProject);
          } else {
            console.log("No project to save");
          }
        });

        globalShortcutRegistered = true;
        console.log("Shortcut registered successfully");
      } catch (error) {
        console.error("Failed to register shortcut:", error);
      }
    };

    setupShortcut();

    return () => {
      if (globalShortcutRegistered) {
        unregister("CommandOrControl+S")
          .then(() => {
            globalShortcutRegistered = false;
            console.log("Shortcut unregistered");
          })
          .catch(console.error);
      }
    };
  }, []);
};
