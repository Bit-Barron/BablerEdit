type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export async function parseJSONFile(file: File): Promise<JsonObject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (typeof json !== "object" || json === null || Array.isArray(json)) {
          reject(new Error("JSON file must contain an object"));
          return;
        }
        resolve(json as JsonObject);
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
    /^([a-z]{2}(-[A-Z]{2})?)$/,
    /\.([a-z]{2}(-[A-Z]{2})?)$/,
    /_([a-z]{2}(-[A-Z]{2})?)$/,
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
  obj: JsonValue,
  currentPath: string[] = []
): Record<string, string> {
  const result: Record<string, string> = {};

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return result;
  }

  for (const key in obj) {
    const value = obj[key];
    const newPath = [...currentPath, key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const nested = flattenJson(value, newPath);
      Object.assign(result, nested);
    } else {
      result[newPath.join(".")] = String(value ?? "");
    }
  }

  return result;
}
