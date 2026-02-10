// Detects framework-specific placeholders in translation text
const PLACEHOLDER_PATTERNS: Record<string, RegExp[]> = {
  // React / i18next / generic: {name}, {{name}}, {0}
  react: [/\{\{?\w+\}?\}/g],
  i18next: [/\{\{?\w+\}?\}/g, /\$t\([^)]+\)/g],
  // Flutter ARB: {name}
  flutter: [/\{[\w]+\}/g],
  // Laravel: :name
  laravel: [/:[\w]+/g],
  // Ruby on Rails: %{name}
  ruby: [/%\{[\w]+\}/g],
  // .NET: {0}, {1}
  resx: [/\{\d+\}/g],
  // Generic: catch-all for common patterns
  json: [/\{\{?\w+\}?\}/g, /%[sd@]/g, /%\d?\$[sd]/g],
  yaml: [/\{\{?\w+\}?\}/g, /%\{[\w]+\}/g],
};

export function detectPlaceholders(
  text: string,
  framework?: string
): string[] {
  if (!text) return [];

  const patterns =
    (framework && PLACEHOLDER_PATTERNS[framework]) ||
    // Use all patterns as fallback
    [
      /\{\{?\w+\}?\}/g,
      /%\{[\w]+\}/g,
      /:\w+/g,
      /%[sd@]/g,
      /%\d?\$[sd]/g,
    ];

  const placeholders: string[] = [];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!placeholders.includes(match[0])) {
        placeholders.push(match[0]);
      }
    }
  }

  return placeholders.sort();
}

export interface PlaceholderValidationResult {
  id: string;
  language: string;
  missing: string[];
  extra: string[];
}

export function validateAllPlaceholders(
  concepts: Array<{
    name: string;
    translations: Array<{ language: string; value: string }>;
  }>,
  primaryLanguage: string,
  framework?: string
): PlaceholderValidationResult[] {
  const results: PlaceholderValidationResult[] = [];

  for (const concept of concepts) {
    const primaryT = concept.translations.find(
      (t) => t.language === primaryLanguage
    );
    if (!primaryT?.value) continue;

    const primaryPlaceholders = detectPlaceholders(primaryT.value, framework);
    if (primaryPlaceholders.length === 0) continue;

    for (const t of concept.translations) {
      if (t.language === primaryLanguage) continue;
      if (!t.value) continue;

      const currentPlaceholders = detectPlaceholders(t.value, framework);
      const missing = primaryPlaceholders.filter(
        (p) => !currentPlaceholders.includes(p)
      );
      const extra = currentPlaceholders.filter(
        (p) => !primaryPlaceholders.includes(p)
      );

      if (missing.length > 0 || extra.length > 0) {
        results.push({
          id: concept.name,
          language: t.language,
          missing,
          extra,
        });
      }
    }
  }

  return results;
}
