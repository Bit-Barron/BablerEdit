import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useId } from "@/hooks/use-id";
import { useSelectionStore } from "@/lib/store/selection.store";
import { Button } from "@/components/ui/button";

interface AddIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddIdDialog: React.FC<AddIdDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedNode } = useSelectionStore();
  const { addIdToJson } = useId();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) return;
    if (!selectedNode) {
      toast.error("Please select a node to add an ID.");
      return;
    }

    if (selectedNode.isLeaf) {
      const segments = selectedNode.data.id.split(".").slice(0, -1).join(".");
      setValue(segments + ".");
    } else {
      setValue(selectedNode.data.id + ".");
    }
  }, [open, selectedNode]);

  if (!selectedNode) return null;

  const newId = value.split(".").pop();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Content className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
          <h1 className="text-lg font-semibold">Add Translation ID</h1>
        </Dialog.Header>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />

          <div className="flex justify-end mt-6 gap-2">
            <Button onClick={() => onOpenChange(false)} className="min-w-25">
              Close
            </Button>
            <Button
              onClick={() => {
                if (newId && selectedNode) {
                  addIdToJson(newId);
                  onOpenChange(false);
                }
              }}
              disabled={!newId}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
