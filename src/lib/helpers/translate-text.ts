import { fetch } from "@tauri-apps/plugin-http";
import { BUILTIN_API_KEYS } from "@/lib/config/api-keys.config";

const LLM_PROVIDERS: Record<string, { url: string; model: string }> = {
  nvidia: {
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
  },
  fireworks: {
    url: "https://api.fireworks.ai/inference/v1/chat/completions",
    model: "accounts/fireworks/models/llama-v3p3-70b-instruct",
  },
  mistral: {
    url: "https://api.mistral.ai/v1/chat/completions",
    model: "mistral-small-2506",
  },
};

// Track current key index per provider for rotation
const keyIndices: Record<string, number> = {};

function getNextKey(provider: string): string {
  const keys = BUILTIN_API_KEYS[provider];
  if (!keys || keys.length === 0) {
    throw new Error(`No API keys configured for provider "${provider}".`);
  }

  const currentIndex = keyIndices[provider] ?? 0;
  const key = keys[currentIndex];
  keyIndices[provider] = (currentIndex + 1) % keys.length;
  return key;
}

async function translateWithLLM(
  text: string,
  sourceLang: string,
  targetLang: string,
  provider: string,
  apiKey: string
): Promise<string> {
  const config = LLM_PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unknown LLM provider: "${provider}".`);
  }

  const content = `You are a professional translator. Translate the provided text from ${sourceLang} to ${targetLang}. Rules:
        - Output ONLY the translated text, nothing else
        - Preserve all formatting, punctuation, and line breaks
        - Do not add explanations, notes, or commentary
        - Keep proper nouns, brand names, and technical terms as-is unless they have an official translation`;

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
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

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  model: string
): Promise<string> => {
  try {
    const provider = model.split(":")[0];
    const keys = BUILTIN_API_KEYS[provider];

    if (!keys || keys.length === 0) {
      throw new Error(
        `No API keys configured for provider "${provider}".`
      );
    }

    const maxRetries = keys.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const apiKey = getNextKey(provider);
      try {
        return await translateWithLLM(text, sourceLang, targetLang, provider, apiKey);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Retry on quota/rate-limit errors, throw on others
        const isQuotaError =
          lastError.message.includes("429") ||
          lastError.message.includes("402") ||
          lastError.message.toLowerCase().includes("quota") ||
          lastError.message.toLowerCase().includes("rate limit");
        if (!isQuotaError || attempt === maxRetries - 1) {
          throw lastError;
        }
        console.warn(`Key exhausted for ${provider}, rotating to next key (attempt ${attempt + 1}/${maxRetries})`);
      }
    }

    throw lastError ?? new Error("Translation failed");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Translation error:", message);
    throw new Error(message);
  }
};
