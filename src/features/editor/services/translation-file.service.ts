import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import parseJson from "parse-json";
import { ParsedProject } from "@/features/project/types/project.types";

export interface TranslationFileData {
  language: string;
  path: string;
  fullPath: string;
  content: Record<string, any>;
}

export class TranslationFileService {
  constructor(private project: ParsedProject) {}

  async readAllFiles(): Promise<TranslationFileData[]> {
    const urls = this.project.translation_packages[0].translation_urls;

    return Promise.all(
      urls.map(async (url) => {
        const fullPath = this.getFullPath(url.path);
        const content = await readTextFile(fullPath);

        return {
          language: url.language,
          path: url.path,
          fullPath,
          content: parseJson(content),
        };
      })
    );
  }

  async writeAllFiles(files: TranslationFileData[]): Promise<void> {
    await Promise.all(
      files.map((file) =>
        writeTextFile(file.fullPath, JSON.stringify(file.content, null, 2))
      )
    );
  }

  async updateAllFiles(
    updater: (content: Record<string, any>) => Record<string, any>
  ): Promise<void> {
    const files = await this.readAllFiles();

    const updatedFiles = files.map((file) => ({
      ...file,
      content: updater(file.content),
    }));

    await Promise.all(
      files.map((file) =>
        writeTextFile(file.fullPath, JSON.stringify(updatedFiles, null, 2))
      )
    );
  }

  private getFullPath(relativePath: string): string {
    return `${this.project.source_root_dir}${relativePath}`;
  }
}
