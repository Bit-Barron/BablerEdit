export interface FileWithPath {
  name: string;
  path: string;
  content: string;
  size: number;
}

export type FrameworkType =
  | "json"
  | "yaml"
  | "i18next"
  | "react"
  | "flutter"
  | "laravel"
  | "ruby"
  | "resx"
  | "xliff"
  | "vue"
  | "properties";

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

type NodeType = "folder" | "package" | "concept";

export interface Translation {
  language: string;
  value: string;
  approved: boolean;
}

export interface ParsedProject {
  version: string;
  be_version: string;
  framework: string;
  filename: string;
  source_root_dir: string;
  is_template_project: boolean;

  languages: Array<{
    code: string;
  }>;

  translation_packages: Array<{
    name: string;
    translation_urls: Array<{
      path: string;
      language: string;
    }>;
  }>;

  editor_configuration: {
    save_empty_translations: boolean;
    translation_order:
      | "alphabetical"
      | "most_complete_first"
      | "least_complete_first";
    custom_languages: Array<string>;
    id_extractor_ignores: Array<string>;
  };

  primary_language: string;

  configuration: Array<{
    indent: string;
    format: string;
    support_arrays: boolean;
  }>;

  preset_collections: Array<[]>;

  folder_structure: {
    name: string;
    children: Array<{
      type: NodeType;
      name: string;
      children: Array<{
        type: NodeType;
        name: string;
        description: string;
        comment: string;
        translations: Translation[];
      }>;
    }>;
  };
}
