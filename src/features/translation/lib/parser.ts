export async function parseJSONFile(file: File): Promise<Record<string, any>> {
  const text = await file.text();
  const json = JSON.parse(text);

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    throw new Error("JSON file must contain an object");
  }

  return json;
}

export function flattenJson(
  obj: Record<string, string>,
  currentPath: string[] = []
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    const newPath = [...currentPath, key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenJson(value, newPath));
    } else {
      result[newPath.join(".")] = String(value ?? "");
    }
  }

  return result;
}
