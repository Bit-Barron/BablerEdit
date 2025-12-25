import { ParsedProject } from "@/lib/types/project.types";
import { toast } from "sonner";
import { useProjectStore } from "@/lib/store/project.store";
import { useSelectionStore } from "@/lib/store/selection.store";
import { useNotification } from "@/components/elements/glass-notification";
import * as TranslationService from "@/lib/services/translation.service";

export const useId = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { selectedNode } = useSelectionStore();
  const { addNotification } = useNotification();

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
      toast.error(`Failed: ${message}`);
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
      toast.error(`Failed: ${message}`);
    }
  };

  return { addIdToJson, removeIdFromJson };
};
