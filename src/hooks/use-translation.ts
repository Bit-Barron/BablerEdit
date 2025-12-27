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
        selectedNodeId: selectedNode?.data.id || "",
        newIdValue: value,
        project: parsedProject!,
      });

      addNotification({
        type: "success",
        title: "ID added!",
        description: `"${value}" added successfully`,
      });
      const updatedProject = await result;
      setParsedProject(updatedProject as ParsedProject);
      return updatedProject;
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
      const updatedProject = await result;
      setParsedProject(updatedProject);
      return updatedProject;
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
        description: "Approval status toggled successfully.",
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

  const changeTranslationValue = async (newValue: string, language: string) => {
    try {
      const result = await TranslationService.updateTranslations({
        project: parsedProject!,
        selectedNode: selectedNode!,
        language,
        newValue,
      });

      setParsedProject(result.updatedProject);
      setTranslationForKey(result.updatedTranslations);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = (comment: string) => {
    const result = TranslationService.addCommentToTranslationId({
      project: parsedProject!,
      selectedNodeId: selectedNode!,
      comment,
    });

    setParsedProject(result.updatedProject);

    addNotification({
      type: "success",
      title: "Translation updated",
      description: "Comment added successfully.",
    });

    return result.updatedProject;
  };
  return {
    addComment,
    toggleApproved,
    addIdToJson,
    removeIdFromJson,
    changeTranslationValue,
  };
};
