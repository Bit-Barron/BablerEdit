import { useProjectStore } from "@/lib/store/project.store";
import { useEditorStore } from "@/lib/store/editor.store";
import { useNotification } from "@/components/elements/toast-notification";
import * as TranslationService from "@/lib/services/translation.service";
import { useTranslationStore } from "@/lib/store/translation.store";
import { ParsedProject } from "@/lib/types/project.types";
import { fetch } from '@tauri-apps/plugin-http'
import { MODEL, NVIDIA_API_KEY, NVIDIA_API_URL, PRIMARYLANG } from "@/lib/config/constants";

export const useTranslation = () => {
  const { selectedNode, setSelectedNode, selectedModel
  } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();
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
      });

      console.error(err)
    }
  };

  const handleTranslation = async (langs: { code: string }[]) => {
    try {
      if (!langs || !selectedModel) {
        addNotification({
          title: "No Model or language Selected",
          description: "Try again later",
          type: "error"
        })
        return;
      }

      const project = parsedProject.folder_structure.children[0].children

      let translationCount = 0;
      let currentProject = parsedProject;

      for (let i = 0; i < project.length; i++) {
        const item = project[i];
        const itemTranslations = item.translations.find((gerTransaltion) => gerTransaltion.language === PRIMARYLANG)
        const itemValue = itemTranslations?.value;
        if (itemValue === "" || itemValue === undefined) continue;

        for (let lang in langs) {
          const langCode = langs[lang].code
          const findIfLangCodeExist = item.translations.find((t) => t.language === langCode)
          if (!findIfLangCodeExist || findIfLangCodeExist.value == "") {
            const response = await fetch(NVIDIA_API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
              },
              body: JSON.stringify({
                model: MODEL,
                messages: [
                  {
                    role: "user",
                    content: `Translate the following text to ${langCode}. Return ONLY the translation, nothing else: \n\n${itemValue}`
                  }
                ],
                max_tokens: 2048,
                temperature: 0.15,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
              })
            })

            const res = await response.json()

            console.log("RESPONSE", res)
          }
        }
      }
      setParsedProject(currentProject);

      addNotification({
        type: "success",
        title: "Translations complete",
        description: `Successfully translated ${translationCount} items`,
      });

    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      addNotification({
        type: "error",
        title: "Translation failed",
        description: message,
      });
    }
  }

  return {
    addComment,
    toggleApproved,
    addIdToJson,
    removeIdFromJson,
    changeTranslationValue,
    handleDeleteLanguage,
    handleTranslation
  };
};
