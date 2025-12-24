import { TreeNodeType } from "@/lib/types/tree.types";
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
      className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent ${
        node.isSelected ? "bg-primary/10" : ""
      }`}
    >
      {isFolder && (
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          <ArrowRightIcon
            size={15}
            className={`ransition-transform ${node.isOpen ? "rotate-90" : ""}`}
          />
        </div>
      )}

      {!isFolder && <div className="w-4" />}

      <div className="flex items-center justify-center shrink-0">
        {isFolder ? (
          node.isOpen ? (
            <FolderOpenIcon size={25} className=" text-yellow-500" />
          ) : (
            <FoldersIcon size={25} className=" text-yellow-500" />
          )
        ) : (
          <FileTextIcon size={20} className="text-muted-foreground" />
        )}
      </div>

      <span className="text-sm truncate">
        {node.data.name.split(".").pop()}
      </span>
    </div>
  );
};
