import { Dialog } from "@/components/ui/retroui/dialog";
import { useEditorStore } from "@/lib/store/editor.store";
import { Button } from "@/components/ui/retroui/button";
import { useProjectStore } from "@/lib/store/project.store";
import { Text } from "@/components/ui/retroui/text";
import { Trash2, Globe, FolderOpen } from "lucide-react";
import * as TranslationServices from "@/lib/services/translation.service";
import { RemoveLangDialog } from "@/components/pages/editor/configure-lang/remove-lang-dialog";
import { AddLanguageDialog } from "@/components/pages/editor/configure-lang/add-lang-dialog";
import { Input } from "@/components/ui/retroui/input";
import ISO6391 from "iso-639-1";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";
import { useNotification } from "@/components/elements/toast-notification";

countries.registerLocale(enLocale);

export const ConfigureLangDialog: React.FC = ({}) => {
  const {
    configureLangDialogOpen,
    setConfigureLangDialogOpen,
    languageToAdd,
    setRemoveLangDialogOpen,
    setLanguageToAdd,
    setAddLangDialogOpen,
  } = useEditorStore();
  const { parsedProject, setParsedProject } = useProjectStore();
  const [translationUrls, setTranslationUrls] = useState<string[]>([]);
  const [languagePaths, setLanguagePaths] = useState<Record<string, string>>(
    {}
  );
  const [newTranslationFile, setNewTranslation] = useState<string>("");
  const { addNotification } = useNotification();
  console.log("test", newTranslationFile);

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

  const checkIfLanguageAlreadyExists = (locale: string) => {
    const newLocale = locale.split("/").pop();
    const existingLocales = parsedProject.translation_packages.map((tp) => {
      return tp.translation_urls.find((tp) => tp.path === newLocale);
    });
    return existingLocales;
  };

  const addPathToLanguage = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Translation File",
            extensions: ["json"],
          },
        ],
      });
      setNewTranslation(selected as string);
      const checkSelectedFile = checkIfLanguageAlreadyExists(
        selected as string
      );
      if (checkSelectedFile) {
        addNotification({
          type: "error",
          title: "Language already exists",
          description: `The selected language translation file already exists in the project.`,
        });
        return;
      }
      if (!selected) return null;
      const readSelectedFile = await readTextFile(selected);

      const obj = parseJson(readSelectedFile);

      console.log(obj);
    } catch (err) {
      console.error("Error adding translation URL:", err);
    }
  };
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
        <Dialog.Content size="md" className="p-0 bg-background">
          <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground">
            Configure Languages
          </Dialog.Header>

          <div className="flex justify-center flex-col gap-4 p-6 bg-muted/30 max-h-100 overflow-y-auto">
            {languageToAdd.length > 0 && (
              <div className="space-y-3">
                <Text className="font-bold mt-5 text-sm px-1">
                  Languages to Add ({languageToAdd.length})
                </Text>
                <div className="flex flex-col gap-3">
                  {languageToAdd.map((locale) => {
                    const [lang, country] = locale.split("-");
                    const langName = ISO6391.getName(lang);
                    const countryName = countries.getName(country, "en");
                    return (
                      <div
                        key={locale}
                        className="bg-background border-2 border-border rounded p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary shrink-0" />
                          <Text className="font-semibold text-sm flex-1">
                            {langName} ({countryName}){" "}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            {locale}
                          </Text>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setLanguageToAdd(
                                languageToAdd.filter((l) => l !== locale)
                              );
                            }}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Text className="text-xs text-muted-foreground">
                            Please select a path for the translation file:
                          </Text>
                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder={`/public/${locale}.json`}
                              value={languagePaths[locale] || ""}
                              onChange={(e) =>
                                setLanguagePaths({
                                  ...languagePaths,
                                  [locale]: e.target.value,
                                })
                              }
                              className="flex-1 text-sm bg-background"
                            />
                            <Button
                              onClick={() => addPathToLanguage()}
                              variant="outline"
                              size="icon"
                              className="shrink-0 h-10 w-10 bg-background"
                              title="Browse for file"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {translationUrls.length > 0 && (
              <div className="space-y-3">
                {translationUrls.map((url, index) => {
                  const urlParts = url.split("/");
                  const fileName = urlParts[urlParts.length - 1];
                  const locale = fileName.replace(".json", "");

                  let displayName = fileName;
                  if (locale.includes("-")) {
                    const [lang, country] = locale.split("-");
                    const langName = ISO6391.getName(lang);
                    const countryName = countries.getName(country, "en");
                    if (langName && countryName) {
                      displayName = `${langName} (${countryName})`;
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="bg-background border-2 border-border rounded p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary shrink-0" />
                        <Text className="font-semibold text-sm flex-1">
                          {displayName}
                        </Text>
                        {locale.includes("-") && (
                          <Text className="text-xs text-muted-foreground">
                            {locale}
                          </Text>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(url)}
                          className="shrink-0 hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          value={url}
                          readOnly
                          className="flex-1 text-sm bg-background"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 h-10 w-10 bg-background"
                          title="Browse for file"
                        >
                          <FolderOpen
                            className="w-4 h-4"
                            onClick={() => addPathToLanguage()}
                          />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {translationUrls.length === 0 && languageToAdd.length === 0 && (
              <div className="text-center py-8">
                <Text className="text-muted-foreground">
                  No translation URLs configured yet
                </Text>
              </div>
            )}
          </div>
          <Dialog.Footer className="flex justify-between">
            <section className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setAddLangDialogOpen(true)}
              >
                Add Language
              </Button>
              <Button
                variant="outline"
                onClick={() => setRemoveLangDialogOpen(true)}
              >
                Remove Language
              </Button>
            </section>
            <Button
              type="button"
              onClick={() => setConfigureLangDialogOpen(false)}
            >
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
      <RemoveLangDialog translationUrls={translationUrls} />
      <AddLanguageDialog />
    </>
  );
};
