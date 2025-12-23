import { useSelectionStore } from "@/features/editor/stores/selection.store";
import { useProjectStore } from "@/features/project/stores/project.store";
import { TranslationManagerService } from "@/features/editor/services/translation-manager.service";
import { useMemo, useEffect } from "react";
import { useTranslationStore } from "@/features/editor/stores/translation.store";

export const useTranslation = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { selectedNode } = useSelectionStore();
  const { currentTranslations, setCurrentTranslations } = useTranslationStore();

  const manager = useMemo(
    () => parsedProject && new TranslationManagerService(parsedProject),
    [parsedProject]
  );

  useEffect(() => {
    if (selectedNode && manager) {
      const translations = manager.getTranslationsForNode(selectedNode.data.id);
      setCurrentTranslations(translations);
    }
  }, [selectedNode, manager]);

  const toggleApproved = (language: string) => {
    if (!selectedNode || !manager) return;

    const updated = manager.toggleApproval(selectedNode.data.id, language);
    setParsedProject(updated);

    const newTranslations = manager.getTranslationsForNode(
      selectedNode.data.id
    );
    setCurrentTranslations(newTranslations);
  };

  const updateValue = (language: string, newValue: string) => {
    if (!selectedNode || !manager) return;

    const updated = manager.updateValue(
      selectedNode.data.id,
      language,
      newValue
    );
    setParsedProject(updated);

    const newTranslations = manager.getTranslationsForNode(
      selectedNode.data.id
    );
    setCurrentTranslations(newTranslations);
  };

  return {
    currentTranslations,
    toggleApproved,
    updateValue,
  };
};
