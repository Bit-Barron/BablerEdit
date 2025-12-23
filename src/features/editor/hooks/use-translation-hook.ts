import { useEditorStore } from "@/features/editor/store/editor.store";
import { useProjectStore } from "@/features/project/store/project.store";

export const useTranslationHook = () => {
  const { selectedNode } = useEditorStore();
  const { parsedProject } = useProjectStore();

  const handleAddCommantary = (language: string) => {};

  const handleApprovedChange = (language: string) => {
    const obj = parsedProject.folder_structure.children[0].children;
    console.log(obj);

    const findNode = obj.find((child) => child.name === selectedNode?.data.id);

    const changeNodeApprovedStatus = findNode?.translations.map((t) => {
      if (t.language === language) {
        const newApprovedStatus = !t.approved;
        return {
          ...t,
          approved: newApprovedStatus,
        };
      }

      return t;
    });

    return changeNodeApprovedStatus;
  };

  return {
    handleAddCommantary,
    handleApprovedChange,
  };
};
