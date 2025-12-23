import {
  ParsedProject,
  Translation,
} from "@/features/project/types/project.types";
import { TranslationFileService } from "./translation-file.service";

export class TranslationManagerService {
  private fileService: TranslationFileService;

  constructor(private project: ParsedProject) {
    this.fileService = new TranslationFileService(project);
  }

  async addId(parentPath: string, newId: string): Promise<void> {
    await this.fileService.updateAllFiles((content) => {
      const cloned = JSON.parse(JSON.stringify(content));
      const parent = this.navigateToPath(cloned, parentPath);

      if (typeof parent === "object" && parent !== null) {
        parent[newId] = "";
      } else {
        throw new Error(`Cannot add ID to non-object at path: ${parentPath}`);
      }

      return cloned;
    });
  }

  async removeId(fullPath: string): Promise<void> {
    await this.fileService.updateAllFiles((content) => {
      const cloned = JSON.parse(JSON.stringify(content));
      const parts = fullPath.split(".");
      const idToRemove = parts.pop();

      if (!idToRemove) {
        throw new Error("Invalid path");
      }

      const parent = this.navigateToPath(cloned, parts.join("."));
      delete parent[idToRemove];

      return cloned;
    });
  }

  async moveId(sourcePath: string, targetPath: string): Promise<void> {
    await this.fileService.updateAllFiles((content) => {
      const cloned = JSON.parse(JSON.stringify(content));

      const value = this.navigateToPath(cloned, sourcePath);
      const idName = sourcePath.split(".").pop()!;

      const sourceParts = sourcePath.split(".");
      const sourceIdName = sourceParts.pop()!;
      const sourceParent = this.navigateToPath(cloned, sourceParts.join("."));
      delete sourceParent[sourceIdName];

      const targetParent = this.navigateToPath(cloned, targetPath);
      targetParent[idName] = value;

      return cloned;
    });
  }

  toggleApproval(nodeId: string, language: string): ParsedProject {
    return {
      ...this.project,
      folder_structure: {
        ...this.project.folder_structure,
        children: this.project.folder_structure.children.map((pkg) => ({
          ...pkg,
          children: pkg.children.map((node) =>
            node.name === nodeId
              ? {
                  ...node,
                  translations: node.translations.map((t) =>
                    t.language === language
                      ? { ...t, approved: !t.approved }
                      : t
                  ),
                }
              : node
          ),
        })),
      },
    };
  }

  updateValue(
    nodeId: string,
    language: string,
    newValue: string
  ): ParsedProject {
    return {
      ...this.project,
      folder_structure: {
        ...this.project.folder_structure,
        children: this.project.folder_structure.children.map((pkg) => ({
          ...pkg,
          children: pkg.children.map((node) =>
            node.name === nodeId
              ? {
                  ...node,
                  translations: node.translations.map((t) =>
                    t.language === language ? { ...t, value: newValue } : t
                  ),
                }
              : node
          ),
        })),
      },
    };
  }

  getTranslationsForNode(nodeId: string): Translation[] {
    const mainPackage = this.project.folder_structure.children[0];
    const node = mainPackage.children.find((child) => child.name === nodeId);
    return node?.translations || [];
  }

  private navigateToPath(obj: any, path: string): any {
    if (!path) return obj;

    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
      if (current[part] === undefined) {
        throw new Error(`Path not found: ${path}`);
      }
      current = current[part];
    }

    return current;
  }
}
