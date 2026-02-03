import { Button } from "@/components/ui/retroui/button";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Input } from "@/components/ui/retroui/input";
import { COMMONLOCALES } from "@/lib/config/constants";
import ISO6391 from "iso-639-1";
import { useEditorStore } from "@/lib/store/editor.store";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { CheckCheckIcon } from "@/components/icons/check-check";
import React, { useState } from "react";
import { useNotification } from "@/components/elements/toast-notification";

countries.registerLocale(enLocale);

export const PreAddLanguageDialog: React.FC = ({ }) => {
  const { preTranslateAddLangDialog, setPreTranslateAddLangDialog,
    preTranslateSelectedLanguage,
    setPreTranslateSelectedLanguage,
  } =
    useEditorStore();
  const [search, setSearch] = useState("");
  const { addNotification } = useNotification()

  const uniqueArray = [...new Set(preTranslateSelectedLanguage)];

  const filtered = COMMONLOCALES.filter((locale) => {
    if (!search) return true;
    const [lang, country] = locale.split("-");
    const langName = ISO6391.getName(lang)?.toLowerCase() || "";
    const countryName = countries.getName(country, "en")?.toLowerCase() || "";
    const q = search.toLowerCase();
    return (
      locale.toLowerCase().includes(q) ||
      langName.includes(q) ||
      countryName.includes(q)
    );
  });


  return (
    <Dialog open={preTranslateAddLangDialog} onOpenChange={setPreTranslateAddLangDialog}>
      <Dialog.Content size="sm" className="p-0 max-w-lg">
        <Dialog.Header className="px-4 pt-4 pb-3 text-sm">
          Add Language
        </Dialog.Header>

        <div className="p-2">
          <Input
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="flex flex-col overflow-y-auto max-h-80 border-t">
          {filtered.map((locale) => {
            const [lang, country] = locale.split("-");
            const langName = ISO6391.getName(lang);
            const countryName = countries.getName(country, "en");

            return (
              <button
                key={locale}
                type="button"
                onClick={() => {
                  if (uniqueArray.includes(locale)) {
                    setPreTranslateSelectedLanguage(
                      preTranslateSelectedLanguage.filter((l) => l !== locale)
                    );
                  } else {
                    if (preTranslateSelectedLanguage.length >= 1) {
                      addNotification({
                        title: "Limit reached",
                        description: "Only one language can be translated at a time.",
                        type: "error",
                      });
                      return;
                    }
                    setPreTranslateSelectedLanguage([locale]);
                  }
                }}
                className="flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b last:border-b-0 w-full"
              >
                <div>
                  <div className="font-medium text-sm">
                    {langName} ({countryName})
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {locale}
                  </div>
                </div>
                {uniqueArray.includes(locale) && (
                  <CheckCheckIcon className="shrink-0 ml-2" />
                )}

              </button>
            );
          })}
        </section>

        <Dialog.Footer className="px-4 pb-4 gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreTranslateAddLangDialog(false)}
          >
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
