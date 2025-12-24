import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useId } from "@/hooks/use-id";
import { useSelectionStore } from "@/stores/selection.store";
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
      <DialogContent className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 shrink-0">
          <DialogTitle className="text-lg font-semibold">
            Add Translation ID
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            - Please enter an ID for the translation. <br />
            - use '.' to create hierarchy, e.g., "menu.file.new". <br />
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="min-w-25"
            >
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
      </DialogContent>
    </Dialog>
  );
};
