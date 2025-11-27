export async function parseJSONFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    reader.readAsText(file);
  });
}

export function extractLanguageCode(filename: string): string | null {
  const nameWithoutExt = filename.replace(/\.(json|yaml|yml|arb|resx)$/i, "");

  const patterns = [
    /^([a-z]{2}(-[A-Z]{2})?)$/, // en, en-US
    /\.([a-z]{2}(-[A-Z]{2})?)$/, // translations.en, messages.en-US
    /_([a-z]{2}(-[A-Z]{2})?)$/, // translations_en, messages_en-US
  ];

  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export function flattenJson(
  obj: any,
  current_path: string[] = []
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    console.log("TESTTTT Current key:", key, "Value:", value);
    const new_path = [...current_path, key];

    if (typeof value === "object" && value !== null) {
      const nested = flattenJson(value, new_path);
      Object.assign(result, nested);
    } else {
      result[new_path.join(".")] = value;
    }
  }

  return result;
}