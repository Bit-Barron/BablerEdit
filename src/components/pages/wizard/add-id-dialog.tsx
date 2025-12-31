import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Input } from "@/components/ui/retroui/input";
import { useEditorStore } from "@/lib/store/editor.store";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/retroui/button";

interface AddIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddIdDialog: React.FC<AddIdDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedNode } = useEditorStore();
  const { addIdToJson } = useTranslation();

  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(open);

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!selectedNode) {
      setValue("");
      return;
    }

    if (selectedNode!.isLeaf) {
      const segments = selectedNode!.data.id.split(".").slice(0, -1).join(".");
      setValue(segments + ".");
    } else {
      setValue(selectedNode!.data.id + ".");
    }
  }, [open, selectedNode]);

  const newId = value.split(".").pop();

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(v) => {
        setDialogOpen(v);
        onOpenChange(v);
      }}
    >
      <Dialog.Content size="md" className="max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
          Add Translation ID
        </Dialog.Header>

        <div className="px-6 pt-3 pb-6 overflow-y-auto flex-1">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>

        <Dialog.Footer className="px-6 pb-6 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (newId) {
                addIdToJson(newId);
                setDialogOpen(false);
                onOpenChange(false);
              }
            }}
            disabled={!newId}
          >
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
