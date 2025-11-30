import { buildTranslationTree } from "@/features/editor/lib/tree-builder";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager-store";
import React, { useEffect } from "react";
import { Tree } from "react-arborist";
import { useNavigate } from "react-router-dom";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";
import { useEditor } from "@/features/editor/hooks/use-editor";

export const EditorPage: React.FC = () => {
  const { parsedProject, defaultLanguageCode } = useFileManagerStore();
  const { handleNodeSelect, selectedNode } = useEditor();

  const navigate = useNavigate();

  useEffect(() => {
    if (!parsedProject) {
      navigate("/");
    }
  }, [parsedProject, navigate]);

  if (!parsedProject) {
    return null;
  }

  const primaryLanguageData = parsedProject.languages.get(
    defaultLanguageCode || "en"
  );

  const treeData = buildTranslationTree(primaryLanguageData);

  return (
    <div className="fixed inset-0 top-[89px] flex">
      <div className="w-[400px] border-r flex flex-col bg-background">
        <div className="border-b px-4 py-3 bg-muted/30 shrink-0">
          <h2 className="font-semibold text-sm">Translation IDs</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tree
            initialData={treeData}
            openByDefault={false}
            width="100%"
            indent={20}
            rowHeight={32}
            onSelect={handleNodeSelect}
          >
            {(props) => <TreeNodeComponent {...props} />}
          </Tree>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <TranslationDetail
          selectedNode={selectedNode}
          project={parsedProject}
        />
      </div>
    </div>
  );
};
