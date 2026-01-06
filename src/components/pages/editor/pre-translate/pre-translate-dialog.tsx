"use client"

import React, { useState } from "react"
import { Dialog } from "@/components/ui/retroui/dialog"
import { Button } from "@/components/ui/retroui/button"
import { Label } from "@/components/ui/retroui/label"
import { RadioGroup } from "@/components/retroui/Radio"
import { CheckboxComponent } from "@/components/ui/retroui/checkbox"
import { useEditorStore } from "@/lib/store/editor.store"
import { useProjectStore } from "@/lib/store/project.store"
import { PlusIcon } from "@/components/icons/plus"
import { Zap, Globe, Cpu, Sparkles, AlertCircle } from "lucide-react"
import { NVIDIA_MODELS, OPTIONS } from "@/lib/config/translation.config"
import { getQualityDots, getSpeedBadge } from "@/lib/utils/translation.helper"
import { useTranslation } from "@/hooks/use-translation"
import { useTranslationStore } from "@/lib/store/translation.store"

export const PreTranslateDialog: React.FC = () => {
  const { preTranslateDialog, setPreTranslateDialog, setSelectedModel, selectedModel } = useEditorStore()
  const { setTranslationOptions } = useTranslationStore()
  const { parsedProject } = useProjectStore()
  const { handleTranslation } = useTranslation()
  const langs: { code: string }[] = parsedProject.languages;
  const [languages, setLanguages] = useState(langs)

  return (
    <Dialog open={preTranslateDialog} onOpenChange={setPreTranslateDialog}>
      <Dialog.Content className="max-w-2xl p-0 overflow-hidden">
        <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground">
          Translations
        </Dialog.Header>

        <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Empty translations will be filled automatically via NVIDIA API.
              Your texts will be sent to NVIDIA servers.
              <span className="text-primary ml-1">Free Tier: ~5000 Credits</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Model</h3>
              </div>

              <RadioGroup
                value={selectedModel}
                onValueChange={setSelectedModel}
                className="space-y-1.5"
              >
                {NVIDIA_MODELS.map((model) => (
                  <div
                    key={model.value}
                    onClick={() => {
                      setSelectedModel(model.value)
                    }}
                    className={`group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 border ${selectedModel === model.value
                      ? "bg-primary/10 border-primary/40"
                      : "border-transparent hover:bg-muted/50 hover:border-border"
                      }`}
                  >
                    <RadioGroup.Item
                      value={model.value}
                      id={model.value}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={model.value}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {model.label}
                        </Label>
                        {getSpeedBadge(model.speed)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted-foreground">
                          {model.description}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">•</span>
                        {getQualityDots(model.quality)}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Languages</h3>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {langs.length} available
                </span>
              </div>

              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className="group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-muted/50 border border-transparent hover:border-border"
                    onClick={() => setLanguages(
                      languages.filter((language) => language.code !== lang.code)
                    )}
                  >
                    <CheckboxComponent id={lang.code} defaultChecked />
                    <Label
                      htmlFor={lang.code}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {lang.code}
                    </Label>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-2">
                <PlusIcon size={14} />
                <span className="ml-1.5">Add language</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Options</h3>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="group flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-muted/50"
                  onClick={() => setTranslationOptions(option.id)}
                >
                  <CheckboxComponent id={option.id} className="mt-0.5" />
                  <div className="flex flex-col">
                    <Label
                      htmlFor={option.id}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {option.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreTranslateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleTranslation(languages)
                setPreTranslateDialog(false)
              }}
            >
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Translate
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
