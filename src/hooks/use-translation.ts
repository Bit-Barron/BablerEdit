import { useProjectStore } from "@/lib/store/project.store";
import { useSelectionStore } from "@/lib/store/selection.store";
import { useNotification } from "@/components/elements/glass-notification";
import * as TranslationService from "@/lib/services/translation.service";
import { useTranslationStore } from "@/lib/store/translation.store";

export const useTranslation = () => {
  const { selectedNode } = useSelectionStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const { addNotification } = useNotification();
  const { setTranslationForKey } = useTranslationStore();

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
  };
};
