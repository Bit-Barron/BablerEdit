import { ParsedProject } from "@/features/translation/types/parser.types";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useSettingsStore } from "@/features/settings/store/settings.store";

export const useEditorHook = () => {
  const { addRecentProject } = useSettingsStore();

  const saveProject = async (project: ParsedProject) => {
    try {
      const path = await save({
        defaultPath: project.filename || "Project.babler",
        filters: [
          {
            name: "BablerEdit Project",
            extensions: ["babler"],
          },
        ],
      });

      if (!path) return;

      const bablerProject: ParsedProject = {
        version: "1.0.0",
        be_version: "1.0.0",
        framework: project.framework,
        filename: project.filename,
        source_root_dir: project.source_root_dir,
        is_template_project: project.is_template_project,
        languages: project.languages,
        translation_packages: project.translation_packages,
        editor_configuration: project.editor_configuration,
        primary_language: project.primary_language,
        configuration: project.configuration,
        preset_collections: project.preset_collections,
        folder_structure: {
          ...project.folder_structure,
          children: project.folder_structure.children.map((pkg) => ({
            ...pkg,
            children: pkg.children.map((concept) => ({
              ...concept,
              translations: concept.translations.map((t) => ({
                language: t.language,
                approved: t.approved,
              })),
            })),
          })),
        } as any,
      };

      const yamlContent = yaml.dump(bablerProject, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
      });

      await writeTextFile(path, yamlContent);

      addRecentProject({
        path: path,
        name: project.filename || "Unnamed Project",
        framework: project.framework,
        language: project.primary_language,
      });

      return bablerProject;
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  return {
    saveProject,
  };
};
