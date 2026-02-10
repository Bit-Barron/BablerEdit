import React, { useEffect, useRef } from "react";
import { NodeApi } from "react-arborist";
import { TreeNodeType } from "@/lib/types/editor.types";

export interface ContextMenuState {
  node: NodeApi<TreeNodeType>;
  x: number;
  y: number;
}

interface TreeContextMenuProps {
  contextMenu: ContextMenuState | null;
  onClose: () => void;
  onRename: (node: NodeApi<TreeNodeType>) => void;
  onDelete: (node: NodeApi<TreeNodeType>) => void;
  onDuplicate: (node: NodeApi<TreeNodeType>) => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: (node: NodeApi<TreeNodeType>) => void;
  canPaste: boolean;
}

export const TreeContextMenu: React.FC<TreeContextMenuProps> = ({
  contextMenu,
  onClose,
  onRename,
  onDelete,
  onDuplicate,
  onCut,
  onCopy,
  onPaste,
  canPaste,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu, onClose]);

  if (!contextMenu) return null;

  const { node, x, y } = contextMenu;
  const fullId = node.data.id;
  const isLeaf = node.isLeaf;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-popover border border-border rounded-md shadow-lg p-1 min-w-56"
      style={{ left: x, top: y }}
    >
      <MenuItem
        label="Rename..."
        shortcut="F2"
        disabled={!isLeaf}
        onClick={() => { onRename(node); onClose(); }}
      />
      <MenuItem
        label="Delete"
        shortcut="Del"
        onClick={() => { onDelete(node); onClose(); }}
      />
      <Separator />
      <MenuItem
        label="Duplicate"
        disabled={!isLeaf}
        onClick={() => { onDuplicate(node); onClose(); }}
      />
      <Separator />
      <MenuItem
        label="Cut"
        shortcut="Ctrl+X"
        disabled={!isLeaf}
        onClick={() => { onCut(); onClose(); }}
      />
      <MenuItem
        label="Copy"
        shortcut="Ctrl+C"
        disabled={!isLeaf}
        onClick={() => { onCopy(); onClose(); }}
      />
      <MenuItem
        label="Paste"
        shortcut="Ctrl+V"
        disabled={!canPaste}
        onClick={() => { onPaste(node); onClose(); }}
      />
      <Separator />
      <MenuItem
        label={`Copy  ${fullId}`}
        shortcut="Ctrl+Alt+1"
        onClick={() => { navigator.clipboard.writeText(fullId); onClose(); }}
      />
      <MenuItem
        label={`Copy  '${fullId}'`}
        shortcut="Ctrl+Alt+2"
        onClick={() => { navigator.clipboard.writeText(`'${fullId}'`); onClose(); }}
      />
    </div>
  );
};

const MenuItem: React.FC<{
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, shortcut, disabled, onClick }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center justify-between px-3 py-1.5 text-sm rounded-sm ${
      disabled
        ? "opacity-40 cursor-default"
        : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
    }`}
  >
    <span className="truncate mr-4">{label}</span>
    {shortcut && (
      <span className="text-xs text-muted-foreground whitespace-nowrap">{shortcut}</span>
    )}
  </div>
);

const Separator: React.FC = () => (
  <div className="h-px bg-border my-1 mx-2" />
);
