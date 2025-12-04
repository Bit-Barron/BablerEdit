export function extractLanguageCode(filename: string): string | null {
  const nameWithoutExt = filename.replace(/\.(FrameworkType)$/i, "");

  const patterns = [
    /^([a-z]{2}(-[A-Z]{2})?)$/, // en, en-US
    /\.([a-z]{2}(-[A-Z]{2})?)$/, // messages.en.json
    /_([a-z]{2}(-[A-Z]{2})?)$/, // messages_en.json
  ];

  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
