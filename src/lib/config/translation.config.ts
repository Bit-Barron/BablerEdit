import { TranslationModel } from "../types/config.types";
import { TranslationOptionsProps } from "../types/editor.types";

export const NVIDIA_MODELS: TranslationModel[] = [
  {
    value: "Qwen/Qwen2.5-7B-Instruct",
    label: "Qwen 2.5 7B Instruct",
    description: "Good general-purpose model",
    speed: "free",
    quality: "good",
  },
  {
    value: "glm-4.5-flash",
    label: "GLM 4.5 Flash",
    description: "Enhanced version for translations",
    speed: "free",
    quality: "good",
  },
  {
    value: "internlm/internlm2_5-7b-chat",
    label: "InternLM 2.5 7B Chat",
    description: "Solid choice for translations",
    speed: "free",
    quality: "good",
  },
  {
    value: "tencent/Hunyuan-MT-7B",
    label: "Hunyuan MT 7B",
    description: "Specifically trained for machine translation",
    speed: "free",
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


