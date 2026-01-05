"use client"

import type React from "react"
import { Dialog } from "@/components/ui/retroui/dialog"
import { Button } from "@/components/ui/retroui/button"
import { Label } from "@/components/ui/retroui/label"
import { RadioGroup } from "@/components/retroui/Radio"
import { CheckboxComponent } from "@/components/ui/retroui/checkbox"
import { useEditorStore } from "@/lib/store/editor.store"
import { useProjectStore } from "@/lib/store/project.store"
import { PlusIcon } from "@/components/icons/plus"
import { InfoIcon } from "lucide-react"

export const PreTranslateDialog: React.FC = () => {
  const { preTranslateDialog, setPreTranslateDialog } = useEditorStore()
  const { parsedProject } = useProjectStore()
  const langs = parsedProject.languages;

  const TRANSLATIONS = [
    { value: "google", label: "Google", icon: "G" },
    { value: "deepl", label: "DeepL", icon: "D" },
    { value: "microsoft", label: "Microsoft", icon: "M" },
    { value: "openai", label: "OpenAI", icon: "O" },
  ]

  return (
    <Dialog open={preTranslateDialog} onOpenChange={setPreTranslateDialog} >
      <Dialog.Content className="max-w-2xl p-0 overflow-hidden">
        <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
          Pre Translation
        </Dialog.Header>

        <div className="px-8 pb-8 space-y-6 mt-5">
          <div className="relative p-4 g-muted/50 border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex gap-3">
              <InfoIcon />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Empty translations will be filled with texts from online services. Your primary language texts will be sent to{" "}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
                Translation Service
              </h3>
              <RadioGroup defaultValue="google" className="space-y-1">
                {TRANSLATIONS.map((service) => (
                  <div
                    key={service.value}
                    className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border"
                  >
                    <RadioGroup.Item
                      value={service.value}
                      id={service.value}
                    />
                    <Label
                      htmlFor={service.value}
                      className="text-sm cursor-pointer group-hover:text-foreground transition-colors"
                    >
                      {service.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
                Languages
              </h3>
              {langs.map((lang) => (
                <div
                  key={lang.code}
                  className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border"
                >
                  <CheckboxComponent
                    id={lang.code}
                    defaultChecked
                  />
                  <div className="flex flex-col">
                    <Label
                      htmlFor={lang.code}
                      className="text-sm cursor-pointer group-hover:text-foreground transition-colors"
                    >
                      {lang.code}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            <section className="flex">
              <Button>
                <PlusIcon size={17} />
                Add new language
              </Button>
            </section>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
              Options
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {[
                { id: "reset", label: "Reset Approved flag", desc: "Clear approval status after translation" },
                { id: "selected", label: "Translate selected items only", desc: "Only process currently selected rows" },
                { id: "overwrite", label: "Overwrite existing translations", desc: "Replace translations that already exist" },
              ].map((option) => (
                <div
                  key={option.id}
                  className="group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border"
                >
                  <CheckboxComponent
                    id={option.id}
                    className="mt-0.5"
                  />
                  <div className="flex flex-col">
                    <Label
                      htmlFor={option.id}
                      className="text-sm cursor-pointer group-hover:text-foreground transition-colors"
                    >
                      {option.label}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {option.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setPreTranslateDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setPreTranslateDialog(false)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Translate
            </span>
          </Button>
        </div>
      </Dialog.Content>
    </Dialog >
  )
}
