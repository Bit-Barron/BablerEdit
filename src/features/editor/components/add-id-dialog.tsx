import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { toast } from "sonner";
import { useIdHook } from "../hooks/use-id";

interface OpenIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddIdDialog: React.FC<OpenIdDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedNode } = useEditorStore();
  const { value, setValue } = useEditorStore();
  const { addIdToJson } = useIdHook();

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
  }, [open, selectedNode, setValue, onOpenChange]);

  if (!selectedNode) return null;

  const addToJson = value.split(".").pop();

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
                if (addToJson && selectedNode) {
                  addIdToJson(addToJson);
                  onOpenChange(false);
                }
              }}
              disabled={!addToJson}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
