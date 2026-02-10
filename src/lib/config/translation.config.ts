import { TranslationModel } from "../types/config.types";
import { TranslationOptionsProps } from "../types/editor.types";

export const TRANSLATION_MODELS: TranslationModel[] = [
  {
    value: "nvidia:meta/llama-3.3-70b-instruct",
    label: "NVIDIA NIM – Llama 3.3 70B",
    description: "Highest rate limit (~120 RPM), great for bulk translations",
    speed: "fast",
    quality: "great",
  },
  {
    value: "fireworks:accounts/fireworks/models/llama-v3p3-70b-instruct",
    label: "Fireworks – Llama 3.3 70B",
    description: "Reliable infrastructure, good rate limit (~60 RPM)",
    speed: "medium",
    quality: "good",
  },
  {
    value: "mistral:mistral-small-latest",
    label: "Mistral – Small Latest",
    description: "Strong multilingual model, non-Llama alternative (~60 RPM)",
    speed: "medium",
    quality: "good",
  },
  {
    value: "google:translate",
    label: "Google Translate",
    description: "Industry standard, 500K chars/month free tier",
    speed: "fast",
    quality: "best",
  },
  {
    value: "deepl:translate",
    label: "DeepL",
    description: "Best quality for European languages, 500K chars/month free",
    speed: "fast",
    quality: "best",
  },
  {
    value: "microsoft:translate",
    label: "Microsoft Translator",
    description: "Azure Cognitive Services, 2M chars/month free tier",
    speed: "fast",
    quality: "great",
  },
];

export const OPTIONS: TranslationOptionsProps[] = [
  {
    id: "reset",
    label: "Reset Approved flag",
    desc: "Clear approval status after translation",
    selected: false,
  },
  {
    id: "selected",
    label: "Translate selected items only",
    desc: "Only process currently selected rows",
    selected: false,
  },
  {
    id: "overwrite",
    label: "Overwrite existing translations",
    desc: "Replace translations that already exist",
    selected: false,
  },
];
