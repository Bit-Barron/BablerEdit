import { useEditor } from "@/hooks/use-editor";
import { useProjectStore } from "@/lib/store/project.store";
import { useEffect, useRef } from "react";

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
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();

        const currentProject = parsedProjectRef.current;
        const currentSaveProject = saveProjectRef.current;

        if (currentProject && Object.keys(currentProject).length > 0) {
          await currentSaveProject(currentProject);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
