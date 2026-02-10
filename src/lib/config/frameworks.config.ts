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
  xliff: "📋",
  properties: "☕",
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
  {
    id: "xliff",
    name: "XLIFF",
    subtitle: "XML",
    color: "text-purple-600",
  },
  {
    id: "vue",
    name: "Vue i18n",
    subtitle: "JSON",
    color: "text-green-600",
  },
  {
    id: "properties",
    name: "Java",
    subtitle: "Properties",
    color: "text-amber-700",
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

  xliff: {
    id: "xliff",
    name: "XLIFF",
    acceptedExtensions: [".xlf", ".xliff"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const content = await file.text();
      if (!content.includes("<xliff") && !content.includes("<trans-unit")) {
        return { valid: false, error: "Invalid XLIFF format" };
      }
      return { valid: true };
    },
    parser: async (content) => {
      // Parse XLIFF XML into key-value pairs
      const result: Record<string, string> = {};
      const unitRegex = /<trans-unit[^>]*id="([^"]*)"[^>]*>[\s\S]*?<target[^>]*>([\s\S]*?)<\/target>[\s\S]*?<\/trans-unit>/g;
      let match;
      while ((match = unitRegex.exec(content)) !== null) {
        result[match[1]] = match[2].trim();
      }
      // Fallback: try source if no target
      if (Object.keys(result).length === 0) {
        const sourceRegex = /<trans-unit[^>]*id="([^"]*)"[^>]*>[\s\S]*?<source[^>]*>([\s\S]*?)<\/source>[\s\S]*?<\/trans-unit>/g;
        while ((match = sourceRegex.exec(content)) !== null) {
          result[match[1]] = match[2].trim();
        }
      }
      return result;
    },
  },

  vue: {
    id: "vue",
    name: "Vue i18n",
    acceptedExtensions: [".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      try {
        const content = await file.text();
        const data = parseJson(content);
        if (typeof data !== "object") {
          return { valid: false, error: "Vue i18n files must be JSON objects" };
        }
        return { valid: true };
      } catch (error) {
        console.error(error);
        return { valid: false, error: "Invalid JSON format" };
      }
    },
    parser: async (content) => JSON.parse(content),
  },

  properties: {
    id: "properties",
    name: "Java Properties",
    acceptedExtensions: [".properties"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    validator: async (file) => {
      const content = await file.text();
      if (!content.trim()) {
        return { valid: false, error: "Empty properties file" };
      }
      return { valid: true };
    },
    parser: async (content) => {
      const result: Record<string, string> = {};
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) continue;
        const eqIdx = trimmed.indexOf("=");
        const colonIdx = trimmed.indexOf(":");
        let sepIdx = -1;
        if (eqIdx >= 0 && colonIdx >= 0) sepIdx = Math.min(eqIdx, colonIdx);
        else if (eqIdx >= 0) sepIdx = eqIdx;
        else if (colonIdx >= 0) sepIdx = colonIdx;
        if (sepIdx >= 0) {
          const key = trimmed.substring(0, sepIdx).trim();
          const value = trimmed.substring(sepIdx + 1).trim();
          result[key] = value;
        }
      }
      return result;
    },
  },
};

export function getFrameworkConfig(
  frameworkId: string
): FrameworkConfig | undefined {
  return FRAMEWORK_CONFIGS[frameworkId as FrameworkType];
}
