import { useProjectStore } from "@/features/project/store/project.store";
import { useSelectionStore } from "@/features/editor/stores/selection.store";
import { TranslationManagerService } from "@/features/editor/services/translation-manager.service";
import { toast } from "sonner";
import { useMemo } from "react";
import { updateProjectFolderStructure } from "@/features/editor/lib/project-updater";
import { ParsedProject } from "@/features/project/types/project.types";

export const useId = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { selectedNode } = useSelectionStore();

  const manager = useMemo(
    () => parsedProject && new TranslationManagerService(parsedProject),
    [parsedProject]
  );

  const addId = async (newId: string) => {
    if (!selectedNode || !parsedProject || !manager) {
      toast.error("No node selected or project not loaded");
      return;
    }

    try {
      const parentPath = selectedNode.isLeaf
        ? selectedNode.data.id.split(".").slice(0, -1).join(".")
        : selectedNode.data.id;

      await manager.addId(parentPath, newId);

      const updated = await updateProjectFolderStructure(parsedProject);
      setParsedProject(updated as ParsedProject);

      toast.success(`ID "${newId}" added successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add ID: ${message}`);
    }
  };

  const removeId = async () => {
    if (!selectedNode || !parsedProject || !manager) {
      toast.error("No node selected");
      return;
    }

    try {
      await manager.removeId(selectedNode.data.id);

      const updated = await updateProjectFolderStructure(parsedProject);
      setParsedProject(updated as ParsedProject);

      toast.success(`ID "${selectedNode.data.name}" removed successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to remove ID: ${message}`);
    }
  };

  return { addId, removeId };
};
