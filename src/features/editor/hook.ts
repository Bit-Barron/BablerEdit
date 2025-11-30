import { useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NodeApi } from "react-arborist";
import { TreeNode } from "./types/editor.types";
import { useEditorPageStore } from "./store/editor-store";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager-store";
import { buildTranslationTree } from "./lib/tree-builder";

export const useEditorHook = () => {
  const navigate = useNavigate();
  const { parsedProject, defaultLanguageCode } = useFileManagerStore();
  const { selectedNode, setSelectedNode } = useEditorPageStore();

  useEffect(() => {
    if (!parsedProject) {
      navigate("/");
    }
  }, [parsedProject, navigate]);

  const treeData = useMemo(() => {
    if (!parsedProject) return [];

    const primaryLanguageData = parsedProject.languages.get(
      defaultLanguageCode || "en"
    );

    return buildTranslationTree(primaryLanguageData);
  }, [parsedProject, defaultLanguageCode]);

  const handleNodeSelect = useCallback(
    (nodes: NodeApi<TreeNode>[]) => {
      if (nodes.length > 0) {
        setSelectedNode(nodes[0]);
      }
    },
    [setSelectedNode]
  );

  return {
    parsedProject,
    treeData,
    selectedNode,
    handleNodeSelect,
  };
};
