import { TranslationModel } from "../types/config.types";
import { TranslationOptionsProps } from "../types/editor.types";

export const NVIDIA_MODELS: TranslationModel[] = [
  {
    value: "kimi-k2",
    label: "Kimi K2 Instruct",
    description: "Optimized for translations",
    speed: "fast",
    quality: "great",
  },
  {
    value: "nemotron-70b",
    label: "Nemotron 70B",
    description: "Highest quality, slower",
    speed: "slow",
    quality: "best",
  },
  {
    value: "mistral-nemo",
    label: "Mistral Nemo 12B",
    description: "Good balance speed/quality",
    speed: "medium",
    quality: "good",
  },
  {
    value: "nemotron-51b",
    label: "Nemotron 51B",
    description: "Faster than 70B, very good",
    speed: "medium",
    quality: "great",
  },
]

export const OPTIONS: TranslationOptionsProps[] = [
  {
    id: "reset",
    label: "Reset Approved flag",
    desc: "Clear approval status after translation",
    selected: false
  },
  {
    id: "selected",
    label: "Translate selected items only",
    desc: "Only process currently selected rows",
    selected: false
  },
  {
    id: "overwrite",
    label: "Overwrite existing translations",
    desc: "Replace translations that already exist",
    selected: false
  },
]


