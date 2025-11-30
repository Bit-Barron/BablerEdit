import { useCallback } from "react";
import { NodeApi } from "react-arborist";
import { TreeNode } from "../types/editor.types";
import { useEditorPageStore } from "../store/editor-store";

export const useEditor = () => {
  const {
    selectedNode,
    setSelectedNode,
    editTranslations,
    updateTranslation,
    hasChanges,
  } = useEditorPageStore();

  const handleNodeSelect = useCallback(
    (nodes: NodeApi<TreeNode>[]) => {
      if (nodes.length > 0) {
        setSelectedNode(nodes[0]);
      }
    },
    [setSelectedNode]
  );

  const handleTranslationChange = useCallback(
    (nodeId: string, language: string, value: string) => {
      updateTranslation(nodeId, language, value);
    },
    [updateTranslation]
  );

  return {
    selectedNode,
    editTranslations,
    hasChanges,
    handleNodeSelect,
    handleTranslationChange,
  };
};
