"use client"
import type React from "react"
import { Dialog } from "@/components/ui/retroui/dialog"
import { Button } from "@/components/ui/retroui/button"
import { Label } from "@/components/ui/retroui/label"
import { RadioGroup } from "@/components/retroui/Radio"
import { CheckboxComponent } from "@/components/ui/retroui/checkbox"
import { useEditorStore } from "@/lib/store/editor.store"
import { useProjectStore } from "@/lib/store/project.store"

export const PreTranslateDialog: React.FC = () => {
  const { preTranslateDialog, setPreTranslateDialog } = useEditorStore()
  const { parsedProject } = useProjectStore()
  const langs = parsedProject.languages;

  console.log(langs)

  return (
    <Dialog open={preTranslateDialog} onOpenChange={setPreTranslateDialog}>
      <Dialog.Content className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        <Dialog.Header>
          <div className="relative px-8 pt-8 pb-6">
            <div className="relative">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Pre-Translate</h2>
                </div>
              </div>
            </div>
          </div>

        </Dialog.Header>
        <div className="px-8 pb-8 space-y-6 mt-5">
          <div className="relative p-4 g-muted/50 border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Empty translations will be filled with texts from online services. Your primary language texts will be sent to{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                  these services
                </a>
                . See our{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                  privacy policy
                </a>{" "}
                for details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
                Translation Service
              </h3>
              <RadioGroup defaultValue="google" className="space-y-1">
                {[
                  { value: "google", label: "Google", icon: "G" },
                  { value: "deepl", label: "DeepL", icon: "D" },
                  { value: "microsoft", label: "Microsoft", icon: "M" },
                  { value: "openai", label: "OpenAI", icon: "O" },
                ].map((service) => (
                  <div
                    key={service.value}
                    className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border"
                  >
                    <RadioGroup.Item
                      value={service.value}
                      id={service.value}
                    />
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {service.icon}
                    </div>
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
                  <Label
                    htmlFor={lang.code}
                    className="text-sm cursor-pointer group-hover:text-foreground transition-colors"
                  >
                    {lang.code}
                  </Label>
                </div>
              ))}
            </div>
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
