import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/retroui/dialog";
import { useEditorStore } from "@/lib/store/editor.store";
import { Button } from "@/components/ui/retroui/button";
import { useProjectStore } from "@/lib/store/project.store";
import { Text } from "@/components/ui/retroui/text";
import { Trash2, Globe } from "lucide-react";
import * as TranslationServices from "@/lib/services/translation.service";
import { RemoveLangDialog } from "@/components/pages/editor/configure-lang/remove-lang-dialog";
import { AddLanguageDialog } from "@/components/pages/editor/configure-lang/add-lang-dialog";

export const ConfigureLangDialog: React.FC = ({}) => {
  const {
    configureLangDialogOpen,
    setConfigureLangDialogOpen,
    setRemoveLangDialogOpen,
    setAddLangDialogOpen,
  } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const [translationUrls, setTranslationUrls] = useState<string[]>([]);

  useEffect(() => {
    if (parsedProject && configureLangDialogOpen) {
      const getSourceRootDir = parsedProject.source_root_dir;
      const translation_packages = parsedProject.translation_packages;

      const urls: string[] = [];
      for (const translationPackage of translation_packages) {
        for (const urlConfig of translationPackage.translation_urls) {
          const BUILD_URL = `${getSourceRootDir}${urlConfig.language}`;
          urls.push(BUILD_URL);
        }
      }

      setTranslationUrls(urls);
    }
  }, [parsedProject, configureLangDialogOpen]);

  const handleDelete = async (url: string) => {
    if (!parsedProject) return;

    const TRANSLATION = url.split("/").pop();
    const result = await TranslationServices.removeTranslationUrl({
      project: parsedProject,
      translation: TRANSLATION!,
    });

    setParsedProject(result);

    setTranslationUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <>
      <Dialog
        open={configureLangDialogOpen}
        onOpenChange={(v) => {
          setConfigureLangDialogOpen(v);
        }}
      >
        <Dialog.Content size="md" className="p-0">
          <Dialog.Header className="px-6 pt-6 pb-4">
            Configure Languages
          </Dialog.Header>

          <div className="flex justify-center flex-col gap-2 p-2">
            {translationUrls.length === 0 ? (
              <div className="text-center py-8">
                <Text className="text-muted-foreground">
                  No translation URLs configured yet
                </Text>
              </div>
            ) : (
              translationUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border-2 rounded bg-card hover:shadow-md transition-all"
                >
                  <Globe className="w-5 h-5 text-primary shrink-0" />
                  <Text className="flex-1 font-medium truncate min-w-0">
                    {url}
                  </Text>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(url)}
                    className="shrink-0 hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}

            <section className="flex justify-between">
              <Button onClick={() => setAddLangDialogOpen(true)}>
                Add Language
              </Button>
              <Button
                variant="outline"
                onClick={() => setRemoveLangDialogOpen(true)}
              >
                Remove Language
              </Button>
            </section>
          </div>

          <Dialog.Footer className="px-6 pb-6 gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfigureLangDialogOpen(false);
              }}
            >
              Cancel
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
      <RemoveLangDialog translationUrls={translationUrls} />
      <AddLanguageDialog />
    </>
  );
};
