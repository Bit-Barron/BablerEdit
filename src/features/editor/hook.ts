import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NodeApi } from "react-arborist";
import { TreeNode } from "./types/editor.types";
import { useEditorPageStore } from "./store/editor-store";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager-store";

export const useEditorHook = () => {
  const navigate = useNavigate();
  const { parsedProject } = useFileManagerStore();
  const { selectedNode, setSelectedNode } = useEditorPageStore();

  useEffect(() => {
    if (!parsedProject) {
      navigate("/");
    }
  }, [parsedProject, navigate]);

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
    selectedNode,
    handleNodeSelect,
  };
};
