import { fetch } from "@tauri-apps/plugin-http";
import { useSettingsStore } from "@/lib/store/setting.store";

async function translateWithLLM(
  text: string,
  sourceLang: string,
  targetLang: string,
  provider: string
): Promise<string> {
  let BASEURL = "";
  let MODEL = "";
  let API_KEY = "";

  const content = `You are a professional translator. Translate the provided text from ${sourceLang} to ${targetLang}. Rules:
        - Output ONLY the translated text, nothing else
        - Preserve all formatting, punctuation, and line breaks
        - Do not add explanations, notes, or commentary
        - Keep proper nouns, brand names, and technical terms as-is unless they have an official translation`;

  if (provider === "nvidia") {
    BASEURL = "https://integrate.api.nvidia.com/v1/chat/completions";
    MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5";
    API_KEY = "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";
  } else if (provider === "together") {
    BASEURL = "https://api.together.xyz/v1/chat/completions";
    MODEL = "meta-llama/Llama-3.2-3B-Instruct-Turbo";
    API_KEY = "tgp_v1_sU05Wxh7GAwfUxAGpBpRoZdGv_wC0bmi77nPtcuAo1o";
  } else if (provider === "fireworks") {
    BASEURL = "https://api.fireworks.ai/inference/v1/chat/completions";
    MODEL = "accounts/fireworks/models/llama-v3p3-70b-instruct";
    API_KEY = "fw_8enJPJ8t36H7JH3TXY7a89";
  } else if (provider === "mistral") {
    BASEURL = "https://api.mistral.ai/v1/chat/completions";
    MODEL = "mistral-small-2506";
    API_KEY = "n6MABaBgi3x09tIJbZVCSMip04NWMZbC";
  }

  const response = await fetch(BASEURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content },
        { role: "user", content: text },
      ],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 65536,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Translate error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.data?.translations?.[0]?.translatedText ?? "";
}

async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const baseUrl = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: sourceLang.toUpperCase(),
      target_lang: targetLang.toUpperCase(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.translations?.[0]?.text ?? "";
}

async function translateWithMicrosoft(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLang}&to=${targetLang}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ text }]),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Microsoft Translator error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data[0]?.translations?.[0]?.text ?? "";
}

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  model: string
): Promise<string> => {
  try {
    const provider = model.split(":")[0];
    const apiKeys = useSettingsStore.getState().apiKeys;

    if (provider === "google") {
      if (!apiKeys.googleTranslate) {
        throw new Error("Google Translate API key not configured. Set it in Tools > API Keys.");
      }
      return await translateWithGoogle(text, sourceLang, targetLang, apiKeys.googleTranslate);
    }

    if (provider === "deepl") {
      if (!apiKeys.deepl) {
        throw new Error("DeepL API key not configured. Set it in Tools > API Keys.");
      }
      return await translateWithDeepL(text, sourceLang, targetLang, apiKeys.deepl);
    }

    if (provider === "microsoft") {
      if (!apiKeys.microsoftTranslator) {
        throw new Error("Microsoft Translator API key not configured. Set it in Tools > API Keys.");
      }
      return await translateWithMicrosoft(text, sourceLang, targetLang, apiKeys.microsoftTranslator);
    }

    // LLM providers (nvidia, together, fireworks, mistral)
    return await translateWithLLM(text, sourceLang, targetLang, provider);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Translation error:", message);
    throw new Error(message);
  }
};
