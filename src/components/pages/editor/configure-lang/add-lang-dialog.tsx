import { Button } from "@/components/ui/retroui/button";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Input } from "@/components/ui/retroui/input";
import { COMMONLOCALES } from "@/lib/config/constants";
import { useEditorStore } from "@/lib/store/editor.store";
import React, { useState, useMemo } from "react";
import ISO6391 from "iso-639-1";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export const AddLanguageDialog: React.FC = ({}) => {
  const { addLangDialogOpen, setAddLangDialogOpen } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocales, setSelectedLocales] = useState<Set<string>>(
    new Set()
  );

  const filteredLocales = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return COMMONLOCALES;

    return COMMONLOCALES.filter((locale) => {
      const [lang, country] = locale.split("-");
      const langName = ISO6391.getName(lang)?.toLowerCase() || "";
      const countryName = countries.getName(country, "en")?.toLowerCase() || "";
      const localeCode = locale.toLowerCase();

      return (
        localeCode.includes(query) ||
        langName.includes(query) ||
        countryName.includes(query)
      );
    });
  }, [searchQuery]);

  const toggleLocale = (locale: string) => {
    setSelectedLocales((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(locale)) {
        newSet.delete(locale);
      } else {
        newSet.add(locale);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    // TODO: Implement save logic to add selected languages
    console.log("Selected locales:", Array.from(selectedLocales));
    setAddLangDialogOpen(false);
    setSelectedLocales(new Set());
    setSearchQuery("");
  };

  const handleCancel = () => {
    setAddLangDialogOpen(false);
    setSelectedLocales(new Set());
    setSearchQuery("");
  };

  return (
    <Dialog
      open={addLangDialogOpen}
      onOpenChange={(v) => {
        setAddLangDialogOpen(v);
        if (!v) {
          setSelectedLocales(new Set());
          setSearchQuery("");
        }
      }}
    >
      <Dialog.Content size="sm" className="p-0 max-w-lg">
        <Dialog.Header className="px-4 pt-4 pb-3 text-sm">
          Add Language
        </Dialog.Header>

        <div className="px-4 pb-3">
          <Input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <section className="flex flex-col overflow-y-auto max-h-80 border-y">
          {filteredLocales.length > 0 ? (
            filteredLocales.map((locale) => {
              const [lang, country] = locale.split("-");
              const langName = ISO6391.getName(lang);
              const countryName = countries.getName(country, "en");
              const isSelected = selectedLocales.has(locale);

              return (
                <button
                  key={locale}
                  type="button"
                  onClick={() => toggleLocale(locale)}
                  className={`px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b last:border-b-0 ${
                    isSelected ? "bg-primary/10 hover:bg-primary/15" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {langName} ({countryName})
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {locale}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No languages found matching "{searchQuery}"
            </div>
          )}
        </section>

        <Dialog.Footer className="px-4 pb-4 gap-2 pt-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {selectedLocales.size > 0
                ? `${selectedLocales.size} language${
                    selectedLocales.size === 1 ? "" : "s"
                  } selected`
                : "Select languages to add"}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={selectedLocales.size === 0}
              >
                Add{" "}
                {selectedLocales.size > 0 ? `(${selectedLocales.size})` : ""}
              </Button>
            </div>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
