import { Button } from "@/components/ui/retroui/button";
import { CheckboxComponent } from "@/components/ui/retroui/checkbox";
import { Dialog } from "@/components/ui/retroui/dialog";
import { useEditorStore } from "@/lib/store/editor.store";
import { useProjectStore } from "@/lib/store/project.store";
import React, { useState } from "react";
import * as TranslationServices from "@/lib/services/translation.service";

interface RemoveLangDialogProps {
  translationUrls: string[];
}

export const RemoveLangDialog: React.FC<RemoveLangDialogProps> = ({
  translationUrls,
}) => {
  const { removeLangDialogOpen, setRemoveLangDialogOpen } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const [selectedUrls, setSelectedUrls] = useState<string>("");

  const translationURLS = translationUrls.map((url) => url.split("/").pop());

  const handleDelete = async (url: string) => {
    if (!parsedProject) return;

    const TRANSLATION = url.split("/").pop();
    const result = await TranslationServices.removeTranslationUrl({
      project: parsedProject,
      translation: TRANSLATION!,
    });

    setParsedProject(result);
  };

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
                <CheckboxComponent
                  onClick={() => setSelectedUrls(t!)}
                  className="w-3.5 h-3.5"
                />{" "}
                {t}
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
              handleDelete(selectedUrls!);
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
