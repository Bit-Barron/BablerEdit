import { TreeNodeType } from "@/lib/types/editor.types";
import React, { CSSProperties } from "react";
import { NodeApi, TreeApi } from "react-arborist";

import { FileTextIcon } from "@/components/icons/file-text";
import { ArrowRightIcon } from "@/components/icons/arrow-right";
import { FolderOpenIcon } from "@/components/icons/folder-open";
import { FoldersIcon } from "@/components/icons/folders";

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
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors border-l-2 ${
        node.isSelected
          ? "bg-primary/10 border-l-primary"
          : "border-l-transparent"
      }`}
    >
      {isFolder && (
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          <ArrowRightIcon
            size={16}
            className={`transition-transform ${node.isOpen ? "rotate-90" : ""}`}
          />
        </div>
      )}

      {!isFolder && <div className="w-4" />}

      <div className="flex items-center justify-center shrink-0">
        {isFolder ? (
          node.isOpen ? (
            <FolderOpenIcon size={22} className="text-yellow-500" />
          ) : (
            <FoldersIcon size={22} className="text-yellow-500" />
          )
        ) : (
          <FileTextIcon size={18} className="text-muted-foreground" />
        )}
      </div>

      <span className="text-sm font-medium truncate">
        {node.data.name.split(".").pop()}
      </span>
    </div>
  );
};
