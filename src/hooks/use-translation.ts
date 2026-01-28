import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useNotification } from "@/components/elements/toast-notification";
import * as TranslationService from "@/lib/services/translation.service";
import { useTranslationStore } from "@/lib/store/translation.store";
import { ParsedProject } from "@/lib/types/project.types";
import { invoke } from "@tauri-apps/api/core"
import { handleTranslationProps } from "@/lib/types/editor.types"
import { delay } from "@/lib/utils/translation";
import { translateText } from "@/lib/helpers/translate-text";

export const useTranslation = () => {
  const { selectedNode, setSelectedNode } = useEditorStore();
  const { parsedProject, setParsedProject, primaryLanguageCode } = useProjectStore();
  const { addNotification } = useNotification();
  const {
    setTranslationForKey,
    setDisplayComment,
    setTranslationUrls,
    translationUrls,
  } = useTranslationStore();

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
      if (!selectedNode) {
        addNotification({
          type: "error",
          title: "No selection",
          description: "Please select a node to remove its ID.",
        });
        return;
      }
      const result = TranslationService.removeTranslationId({
        selectedNodeId: selectedNode!.data.id,
        project: parsedProject!,
      });

      setSelectedNode(null);
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

      addNotification({
        type: "success",
        title: "Translation updated",
        description: "Translation value updated successfully.",
      });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to update translation",
        description: message,
      });
    }
  };

  const addComment = (comment: string) => {
    try {
      const result = TranslationService.addCommentToTranslationId({
        project: parsedProject!,
        selectedNodeId: selectedNode!,
        comment,
      });

      setParsedProject(result.updatedProject);
      setDisplayComment(comment);

      addNotification({
        type: "success",
        title: "Translation updated",
        description: "Comment added successfully.",
      });

      return result.updatedProject;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Failed to add comment",
        description: message,
      });
    }
  };

  const handleDeleteLanguage = async (url: string) => {
    try {
      if (!parsedProject) return;

      const TRANSLATION = url.split("/").pop();
      const result = await TranslationService.removeTranslationUrl({
        project: parsedProject,
        translation: TRANSLATION!,
      });

      setParsedProject(result);

      setTranslationUrls(translationUrls.filter((u) => u !== url));

    } catch (err) {
      addNotification({
        type: "error",
        title: "Failed to add comment",
      })

      console.error(err)
    }
  };

  const handleTranslation = async (langs: handleTranslationProps[], model: string) => {
    try {
      const getNewAddedLangs = langs.filter((l) => l.newAddedlanguage).map((t) => t.code);
      let counter = 0;

      if (!getNewAddedLangs.length) {
        addNotification({
          type: "error",
          title: "No new language selected",
          description: "Please select at least one new language to translate.",
        });
        return;
      };

      const project = parsedProject.folder_structure.children[0].children;
      const translatedItems: { index: number; value: string }[] = [];

      for (let i = 0; i < project.length; i++) {
        const primaryTranslation = project[i].translations.find(
          (t) => t.language === primaryLanguageCode
        );

        if (!primaryTranslation?.value) continue;

        counter += 1;
        addNotification({
          type: "info",
          title: "Translating...",
          description: `Translating text ${counter} of ${project.length} to ${getNewAddedLangs[0]}.`,
        });

        const translated = await translateText(
          primaryTranslation.value,
          primaryLanguageCode,
          getNewAddedLangs[0],
          model,
        );

        if (translated) {
          translatedItems.push({ index: i, value: translated });
        }

        await delay(1000);
      }

      const updatedFolderStructure = {
        ...parsedProject,
        folder_structure: {
          ...parsedProject.folder_structure,
          children: parsedProject.folder_structure.children.map((pkg, pkgIndex) =>
            pkgIndex === 0
              ? {
                ...pkg,
                children: pkg.children.map((item, itemIndex) => {
                  const found = translatedItems.find((t) => t.index === itemIndex);
                  return found
                    ? {
                      ...item,
                      translations: [
                        ...item.translations,
                        {
                          language: getNewAddedLangs[0],
                          value: found.value,
                          approved: false,
                        }
                      ]
                    }
                    : item;
                })
              }
              : pkg
          )
        }
      };

      setParsedProject(updatedFolderStructure);
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failed to translate",
        description: "An error occurred during translation.",
      });
      console.error(err);
    }
  };

  return {
    addComment,
    toggleApproved,
    addIdToJson,
    removeIdFromJson,
    changeTranslationValue,
    handleDeleteLanguage,
    handleTranslation,
  };
};
