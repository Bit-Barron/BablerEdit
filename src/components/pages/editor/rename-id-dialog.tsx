import React, { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor.store";
import { useTranslation } from "@/hooks/use-translation";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Button } from "@/components/ui/retroui/button";
import { Input } from "@/components/ui/retroui/input";
import { Label } from "@/components/ui/retroui/label";

export const RenameIdDialog: React.FC = () => {
  const { renameDialogOpen, setRenameDialogOpen, selectedNode } =
    useEditorStore();
  const { renameId } = useTranslation();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (renameDialogOpen && selectedNode) {
      setNewName(selectedNode.data.id);
    }
  }, [renameDialogOpen, selectedNode]);

  const handleRename = async () => {
    if (!selectedNode || !newName.trim()) return;
    await renameId(selectedNode.data.id, newName.trim());
    setRenameDialogOpen(false);
    setNewName("");
  };

  return (
    <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
      <Dialog.Content size="md" className="max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
          Rename Translation ID
        </Dialog.Header>
        <section className="px-6 pt-3 pb-6 space-y-4">
          <div className="space-y-2">
            <Label>Current ID</Label>
            <Input
              value={selectedNode?.data.id || ""}
              disabled
              className="w-full bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label>New ID</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
              className="w-full"
              placeholder="Enter new translation ID..."
              autoFocus
            />
          </div>
        </section>
        <Dialog.Footer className="px-6 pb-6 gap-2">
          <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={!newName.trim() || newName === selectedNode?.data.id}
          >
            Rename
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
