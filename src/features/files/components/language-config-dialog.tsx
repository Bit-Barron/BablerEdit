import { Plus, Minus } from "lucide-react";
import React from "react";
import { Button } from "../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog";
import { FrameworkDropzone } from "./language-upload-dropzone";
import { LanguageList } from "./language-list";
import { useFilesStore } from "../store/file-store";

interface FrameworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FrameworkDialog: React.FC<FrameworkDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { defaultLanguageCode } = useFilesStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Configure languages
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add or remove languages and their corresponding translation files:
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          <section className="flex justify-center items-center">
            <FrameworkDropzone />
          </section>

          <LanguageList />

          <div className="mt-2">
            <Button size="sm" variant="outline">
              Primary Language: {defaultLanguageCode}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add language
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Minus className="h-4 w-4" />
              Remove language
            </Button>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
