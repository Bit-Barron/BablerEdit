export interface FileType {
  id: string;
  name: string;
  subtitle: string;
  color: string;
}
export interface BablerProject {
  version: string;
  framework: string;
  filename: string;
  sourceRootDir: string;
  primaryLanguage: string;

  languages: BablerLanguage[];

  translationPackages: BablerTranslationPackage[];

  editorConfiguration: BablerEditorConfig;

  metadata: {
    createdAt: string;
    lastModified: string;
    beVersion: string;
  };
}

export interface BablerLanguage {
  code: string;
  name?: string;
}

export interface BablerTranslationPackage {
  name: string;
  translationUrls: BablerTranslationUrl[];
}

export interface BablerTranslationUrl {
  path: string;
  language: string;
}

export interface BablerEditorConfig {
  saveEmptyTranslations: boolean;
  translationOrder: "alphabetically" | "custom";
  indent: "tab" | "spaces";
  format: string;
  supportArrays: boolean;
}

export interface BablerTranslationNode {
  id: string;
  type: "folder" | "concept";
  name: string;
  description?: string;
  comment?: string;
  children?: BablerTranslationNode[];
  translations?: BablerTranslation[];
}

export interface BablerTranslation {
  language: string;
  value: string;
  approved: boolean;
}
