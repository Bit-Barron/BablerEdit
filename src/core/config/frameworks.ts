import parseJson from "parse-json";
import { FrameworkConfig, FrameworkType } from "../types/framework.types";

export const FRAMEWORK_CONFIGS: Record<FrameworkType, FrameworkConfig> = {
  json: {
    id: "json",
    name: "Generic JSON",
    acceptedExtensions: [".json"],
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
    validator: async (file) => {
      try {
        const content = await file.text();
        parseJson(content);
        return { valid: true };
      } catch (error) {
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
      // Basic YAML validation
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
          return { valid: false, error: "Invalid JSON format" };
        }
      }
      return { valid: true }; // PHP files need backend validation
    },
    parser: async (content) => {
      // Will handle PHP array parsing later
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
