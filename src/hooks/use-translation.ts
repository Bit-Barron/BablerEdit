import { useProjectStore } from "@/lib/store/project.store";
import { ParsedProject } from "@/lib/types/project.types";
import { useSelectionStore } from "@/lib/store/selection.store";
import { useTranslationStore } from "@/lib/store/translation.store";

export const useTranslation = () => {
  const { selectedNode } = useSelectionStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const { setTranslationForKey } = useTranslationStore();

  const toggleApproved = (language: string) => {
    const obj = parsedProject.folder_structure.children[0].children;
    const findNode = obj.find((child) => child.name === selectedNode?.data.id);

    const updatedTranslations = findNode?.translations.map((t) => {
      if (t.language === language) {
        return { ...t, approved: !t.approved };
      }
      return t;
    });

    setTranslationForKey(updatedTranslations!);

    const updatedProject: ParsedProject = {
      ...parsedProject,
      folder_structure: {
        ...parsedProject.folder_structure,
        children: [
          {
            ...parsedProject.folder_structure.children[0],
            children: parsedProject.folder_structure.children[0].children.map(
              (node) =>
                node.name === selectedNode?.data.id
                  ? { ...node, translations: updatedTranslations! }
                  : node
            ),
          },
        ],
      },
    };

    setParsedProject(updatedProject);
    return updatedProject;
  };

  return {
    toggleApproved,
  };
};
