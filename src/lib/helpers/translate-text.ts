import { invoke } from "@tauri-apps/api/core";

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  model: string,
): Promise<string> => {
  try {
    const response = await fetch("")
    // const response = await invoke<string>("translate_text", {
    //   model: !model ? "nvidia/riva-translate-4b-instruct-v1.1" : model,
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are an expert at translating text from ${sourceLang} to ${targetLang}.`
    //     },
    //     {
    //       role: "user",
    //       content: `What is the ${targetLang} translation of: ${text}`
    //     }
    //   ]
    // });

    return ""
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("error", message)
    throw err;
  }
};


