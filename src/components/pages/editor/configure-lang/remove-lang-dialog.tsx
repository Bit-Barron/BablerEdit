import { Button } from "@/components/ui/retroui/button";
import { CheckboxComponent } from "@/components/ui/retroui/checkbox";
import { Dialog } from "@/components/ui/retroui/dialog";
import { useEditorStore } from "@/lib/store/editor.store";
import React from "react";

interface RemoveLangDialogProps {
  translationUrls: string[];
}

export const RemoveLangDialog: React.FC<RemoveLangDialogProps> = ({
  translationUrls,
}) => {
  const { removeLangDialogOpen, setRemoveLangDialogOpen } = useEditorStore();

  const translationURLS = translationUrls.map((url) => url.split("/").pop());

  return (
    <Dialog
      open={removeLangDialogOpen}
      onOpenChange={(v) => {
        setRemoveLangDialogOpen(v);
      }}
    >
      <Dialog.Content size="sm" className="p-0 max-w-sm">
        <Dialog.Header className="px-4 pt-4 pb-2 text-sm">
          Remove Language
        </Dialog.Header>

        <section className="flex flex-col">
          {translationURLS.map((t) => {
            return (
              <section
                className="flex items-center gap-2 px-4 py-2 border-t text-sm"
                key={t}
              >
                <CheckboxComponent className="w-3.5 h-3.5" /> {t}
              </section>
            );
          })}
        </section>
        <Dialog.Footer className="px-4 pb-4 gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRemoveLangDialogOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setRemoveLangDialogOpen(false);
            }}
          >
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
