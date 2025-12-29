import parseJson from "parse-json";
import { FrameworkConfig, FrameworkType } from "@/lib/types/project.types";
import { FileType } from "@/lib/types/config.types";

const FRAMEWORK_ICONS: Record<string, string> = {
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

export function getFrameworkIcon(id: string): string {
  return FRAMEWORK_ICONS[id] || "📄";
}

export const FILETYPES: FileType[] = [
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

export const FRAMEWORK_CONFIGS: Record<FrameworkType, FrameworkConfig> = {
  json: {
    id: "json",
    name: "Generic JSON",
    acceptedExtensions: [".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      try {
        const content = await file.text();
        parseJson(content);
        return { valid: true };
      } catch (error) {
        console.error(error);
        return { valid: false, error: "Invalid JSON format" };
      }
    },
    parser: async (content) => JSON.parse(content),
  },

  yaml: {
    id: "yaml",
    name: "Generic YAML",
    acceptedExtensions: [".yaml", ".yml"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const content = await file.text();
      if (!content.trim()) {
        return { valid: false, error: "Empty YAML file" };
      }
      return { valid: true };
    },
    parser: async (content) => {
      return content;
    },
  },

  i18next: {
    id: "i18next",
    name: "i18next",
    acceptedExtensions: [".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      try {
        const content = await file.text();
        const data = parseJson(content);
        if (typeof data !== "object") {
          return { valid: false, error: "i18next files must be objects" };
        }
        return { valid: true };
      } catch (error) {
        console.error(error);
        return { valid: false, error: "Invalid JSON format" };
      }
    },
    parser: async (content) => JSON.parse(content),
  },

  flutter: {
    id: "flutter",
    name: "Flutter ARB",
    acceptedExtensions: [".arb"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      try {
        const content = await file.text();
        parseJson(content);
        return { valid: true };
      } catch (error) {
        console.error(error);

        return { valid: false, error: "Invalid ARB format" };
      }
    },
    parser: async (content) => JSON.parse(content),
  },

  react: {
    id: "react",
    name: "React i18n",
    acceptedExtensions: [".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      try {
        const content = await file.text();
        parseJson(content);
        return { valid: true };
      } catch (error) {
        console.error(error);
        return { valid: false, error: "Invalid JSON format" };
      }
    },
    parser: async (content) => JSON.parse(content),
  },

  laravel: {
    id: "laravel",
    name: "Laravel",
    acceptedExtensions: [".php", ".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "json") {
        try {
          const content = await file.text();
          parseJson(content);
          return { valid: true };
        } catch (error) {
          console.error(error);
          return { valid: false, error: "Invalid JSON format" };
        }
      }
      return { valid: true };
    },
    parser: async (content) => {
      return parseJson(content);
    },
  },

  ruby: {
    id: "ruby",
    name: "Ruby on Rails",
    acceptedExtensions: [".yml", ".yaml"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const content = await file.text();
      if (!content.trim()) {
        return { valid: false, error: "Empty YAML file" };
      }
      return { valid: true };
    },
    parser: async (content) => content,
  },

  resx: {
    id: "resx",
    name: ".NET RESX",
    acceptedExtensions: [".resx"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const content = await file.text();
      if (!content.includes("<?xml") || !content.includes("<root>")) {
        return { valid: false, error: "Invalid RESX XML format" };
      }
      return { valid: true };
    },
    parser: async (content) => content,
  },
};

export function getFrameworkConfig(
  frameworkId: string
): FrameworkConfig | undefined {
  return FRAMEWORK_CONFIGS[frameworkId as FrameworkType];
}
