import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/elements/alert-dialog";
import { Input } from "@/components/ui/input";
import { useSelectionStore } from "@/lib/store/selection.store";
import { useTranslation } from "@/hooks/use-translation";

interface AddIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddIdDialog: React.FC<AddIdDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedNode } = useSelectionStore();
  const { addIdToJson } = useTranslation();

  const [value, setValue] = useState("");

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
        <AlertDialogHeader className="px-6 pt-6 pb-3 shrink-0">
          <AlertDialogTitle>Add Translation ID</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 pt-3 pb-6 overflow-y-auto flex-1">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>

        <AlertDialogFooter className="px-6 pb-6 gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (newId) {
                addIdToJson(newId);
                onOpenChange(false);
              }
            }}
            disabled={!newId}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
