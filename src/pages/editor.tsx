import { buildTranslationTree } from "@/features/editor/lib/build-tree";
import { useFilesStore } from "@/features/files/store/file-store";
import React, { useEffect } from "react";
import { Tree } from "react-arborist";
import { useNavigate } from "react-router-dom";
import { useEditorPageStore } from "@/features/editor/store/editor-store";
import { TreeNode as TreeNodeComponent } from "@/features/editor/components/editor-tree-node";
import { TranslationDetail } from "@/features/editor/components/editor-detail-panel";

export const EditorPage: React.FC = () => {
  const { parsedProject, defaultLanguageCode } = useFilesStore();
  const { selectedNode, setSelectedNode } = useEditorPageStore();
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
            onSelect={(nodes) => {
              if (nodes.length > 0) {
                setSelectedNode(nodes[0]);
              }
            }}
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
