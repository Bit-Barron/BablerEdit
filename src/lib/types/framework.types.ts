export type FrameworkType =
  | "json"
  | "yaml"
  | "i18next"
  | "react"
  | "flutter"
  | "laravel"
  | "ruby"
  | "resx";

export interface FrameworkConfig {
  id: FrameworkType;
  name: string;
  acceptedExtensions: string[];
  maxFiles: number;
  maxSize: number;
  requiresPairs?: boolean;
  validator?: (file: File) => Promise<{ valid: boolean; error?: string }>;
  parser: (content: string) => Promise<any>;
}
