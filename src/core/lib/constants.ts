export function getFrameworkIcon(id: string): string {
  const icons: Record<string, string> = {
    angular: "🅰️",
    vue: "🇻",
    i18next: "🌐",
    react: "⚛️",
    flutter: "🦋",
    laravel: "🔧",
    ember: "🔥",
    ruby: "💎",
    svelte: "🔶",
    java: "☕",
    resx: ".NET",
    json: "{ }",
    yaml: "≡",
  };
  return icons[id] || "📄";
}

export const FILETYPES = [
  { id: "json", name: "Generic", subtitle: "JSON", color: "text-gray-600" },
  { id: "yaml", name: "Generic", subtitle: "YAML", color: "text-gray-600" },
  { id: "i18next", name: "i18next", subtitle: "", color: "text-blue-600" },
  { id: "react", name: "React", subtitle: "", color: "text-cyan-600" },
  { id: "flutter", name: "Flutter", subtitle: "ARB", color: "text-blue-400" },
  { id: "laravel", name: "Laravel", subtitle: "...", color: "text-red-500" },
  { id: "ember", name: "Ember", subtitle: "...", color: "text-orange-600" },
  {
    id: "ruby",
    name: "Ruby on Rails",
    subtitle: "YAML",
    color: "text-red-700",
  },
];
