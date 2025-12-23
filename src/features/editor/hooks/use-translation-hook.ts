import { useEditorStore } from "@/features/editor/store/editor.store";
import { useProjectStore } from "@/features/project/store/project.store";
import { ParsedProject } from "@/features/project/types/project.types";

export const useTranslationHook = () => {
  const { selectedNode, setTranslationForKey } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();

  const handleAddCommantary = () => {};

  const handleApprovedChange = (language: string) => {
    const obj = parsedProject.folder_structure.children[0].children;

    const findNode = obj.find((child) => child.name === selectedNode?.data.id);

    const changeNodeApprovedStatus = findNode?.translations.map((t) => {
      if (t.language === language) {
        return {
          ...t,
          approved: !t.approved,
        };
      }

      return t;
    });
    setTranslationForKey(changeNodeApprovedStatus!);

    const updatedParsedProject: ParsedProject = {
      ...parsedProject,
      folder_structure: {
        ...parsedProject.folder_structure,
        children: [
          {
            ...parsedProject.folder_structure.children[0],
            children: parsedProject.folder_structure.children[0].children.map(
              (node) =>
                node.name === selectedNode?.data.id
                  ? { ...node, translations: changeNodeApprovedStatus! }
                  : node
            ),
          },
        ],
      },
    };

    setParsedProject(updatedParsedProject);

    return updatedParsedProject;
  };

  return {
    handleAddCommantary,
    handleApprovedChange,
  };
};
