import { ParsedProject } from "@/features/project/types/project.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { serializeProject } from "@/features/editor/lib/project-serializer";

export class ProjectPersistenceService {
  async saveProject(
    project: ParsedProject,
    currentPath: string | null
  ): Promise<{ path: string; project: ParsedProject }> {
    let savePath = currentPath;

    if (!savePath) {
      const selected = await save({
        defaultPath: project.filename || "Project.babler",
        filters: [{ name: "BablerEdit Project", extensions: ["babler"] }],
      });

      if (!selected) {
        throw new Error("Save cancelled");
      }

      savePath = selected;
    }

    const serialized = serializeProject(project);
    const yamlContent = yaml.dump(serialized, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    await writeTextFile(savePath, yamlContent);

    return { path: savePath, project: serialized };
  }

  async openProject(): Promise<{ path: string; project: ParsedProject }> {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [{ extensions: ["babler"], name: "BablerEdit Project" }],
    });

    if (!selected) {
      throw new Error("Open cancelled");
    }

    const content = await readTextFile(selected);
    const project = yaml.load(content) as ParsedProject;

    return { path: selected, project };
  }
}
