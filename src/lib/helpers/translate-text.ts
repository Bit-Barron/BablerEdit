import { fetch } from "@tauri-apps/plugin-http";

// NVIDIA AI IS WORKING; FAST
// FIREWORK AI IS WORKING; FAST.
// MISTRAL IS WORKING; FAST
// TOGEHTER AI NOT WORKING RN  // ISSUE CREDITS

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  model: string,
): Promise<string> => {
  try {
    let BASEURL: string = ""
    let MODEL: string = ""
    let API_KEY: string = ""

    const content = `You are a professional translator.Translate the provided text from ${sourceLang} to ${targetLang}.Rules:
        - Output ONLY the translated text, nothing else
        - Preserve all formatting, punctuation, and line breaks
        - Do not add explanations, notes, or commentary
        - Keep proper nouns, brand names, and technical terms as- is unless they have an official translation`

    const splitModel = model.split(":")[0]

    if (splitModel === "nvidia") {

      BASEURL = "https://integrate.api.nvidia.com/v1/chat/completions"
      MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5"
      API_KEY = "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"
      console.log("Using NVIDIA model")

    } else if (splitModel === "groq") {

      BASEURL = "https://integrate.api.nvidia.com/v1/chat/completions"
      MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5"
      API_KEY = "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"
      console.log("Using GROQ model")

    } else if (splitModel === "together") {

      BASEURL = "https://api.together.xyz/v1/chat/completions"
      MODEL = "meta-llama/Llama-3.2-3B-Instruct-Turbo"
      API_KEY = "tgp_v1_sU05Wxh7GAwfUxAGpBpRoZdGv_wC0bmi77nPtcuAo1o"
      console.log("Using TOGETHER AI model")

    } else if (splitModel === "fireworks") {

      BASEURL = "https://api.fireworks.ai/inference/v1/chat/completions"
      MODEL = "accounts/fireworks/models/llama-v3p3-70b-instruct"
      API_KEY = "fw_8enJPJ8t36H7JH3TXY7a89"
      console.log("Using FIREWORKS model")

    } else if (splitModel === "mistral") {

      BASEURL = "https://api.mistral.ai/v1/chat/completions"
      MODEL = "mistral-small-2506"
      API_KEY = "n6MABaBgi3x09tIJbZVCSMip04NWMZbC"
      console.log("Using MISTRAL model")
    }

    const response = await fetch(`${BASEURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: `${MODEL}`,
        messages: [{ role: "system", content: content, }, { role: "user", content: text }],
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 65536,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content ?? "";
    console.log("TRANSLATED TEXT", translated)

    return translated
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Translation error:", message);
    throw new Error(message)
  }
};


