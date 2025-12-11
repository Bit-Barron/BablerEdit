import { Folder, FolderOpen, ChevronRight, FileText } from "lucide-react";
import React, { CSSProperties } from "react";
import { NodeApi, TreeApi } from "react-arborist";
import { TreeNodeType } from "../types/tree.types";

interface TreeNodeProps {
  style: CSSProperties;
  node: NodeApi<TreeNodeType>;
  tree: TreeApi<TreeNodeType>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  style,
  dragHandle,
}) => {
  const isFolder = !node.isLeaf;

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={() => node.isInternal && node.toggle()}
      className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent ${
        node.isSelected ? "bg-primary/10" : ""
      }`}
    >
      {isFolder && (
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          <ChevronRight
            className={`w-3 h-3 transition-transform ${
              node.isOpen ? "rotate-90" : ""
            }`}
          />
        </div>
      )}

      {!isFolder && <div className="w-4" />}

      <div className="w-4 h-4 flex items-center justify-center shrink-0">
        {isFolder ? (
          node.isOpen ? (
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500" />
          )
        ) : (
          <FileText className="w-3 h-3 text-muted-foreground" />
        )}
      </div>

      <span className="text-sm truncate">
        {node.data.name.split(".").pop()}
      </span>
    </div>
  );
};
