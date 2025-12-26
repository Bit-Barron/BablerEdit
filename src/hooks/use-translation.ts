import { useProjectStore } from "@/lib/store/project.store";
import { useSelectionStore } from "@/lib/store/selection.store";
import { useNotification } from "@/components/elements/glass-notification";
import * as TranslationService from "@/lib/services/translation.service";
import { useTranslationStore } from "@/lib/store/translation.store";
import { ParsedProject } from "@/lib/types/project.types";

export const useTranslation = () => {
  const { selectedNode } = useSelectionStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const { addNotification } = useNotification();
  const { setTranslationForKey } = useTranslationStore();

  const addIdToJson = async (value: string) => {
    try {
      const result = TranslationService.addTranslationId({
        selectedNodeId: selectedNode!.data.id,
        newIdValue: value,
        project: parsedProject!,
      });

      addNotification({
        type: "success",
        title: "ID added!",
        description: `"${value}" added successfully`,
      });
      setParsedProject((await result).updatedProject as ParsedProject);
      return (await result).updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to add ID",
        description: message,
      });
    }
  };

  const removeIdFromJson = async () => {
    try {
      const result = TranslationService.removeTranslationId({
        selectedNodeId: selectedNode!.data.id,
        project: parsedProject!,
      });
      addNotification({
        type: "success",
        title: "ID removed!",
        description: `ID removed successfully`,
      });
      setParsedProject((await result).updatedProject);
      return (await result).updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to remove ID",
        description: message,
      });
    }
  };

  const toggleApproved = (language: string) => {
    if (!selectedNode || !parsedProject) return;

    try {
      const result = TranslationService.toggleTranslationApproval({
        project: parsedProject,
        language,
        selectedNodeId: selectedNode,
      });
      setParsedProject(result.updatedProject);
      setTranslationForKey(result.updatedTranslations);

      addNotification({
        type: "success",
        title: "Translation updated",
      });
      return result.updatedProject;
    } catch (err) {
      console.error(err);
      addNotification({
        type: "error",
        title: "Error",
        description: "Failed to toggle approval status.",
      });
    }
  };

  return {
    toggleApproved,
    addIdToJson,
    removeIdFromJson,
  };
};
