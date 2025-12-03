import { ParsedProject } from "@/features/translation/types/parser.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { flattenJson } from "@/features/translation/lib/parser";

export const useEditorHook = () => {
  const { addRecentProject } = useSettingsStore();
  const { setParsedProject } = useFileManagerStore();
  const navigate = useNavigate();

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
                value: t.value,
                approved: t.approved,
              })),
            })),
          })),
        },
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
  const openProject = async () => {
    try {
      const openFile = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            extensions: ["babler"],
            name: "BablerEdit Project",
          },
        ],
      });
      if (!openFile) return;

      const fileContent = await readTextFile(openFile);
      const parsedProject = yaml.load(fileContent) as ParsedProject;

      const loadedTranslations = await Promise.all(
        parsedProject.translation_packages[0].translation_urls.map(
          async (trans) => {
            const fullPath = `${parsedProject.source_root_dir}${trans.path}`;
            const jsonContent = await readTextFile(fullPath);
            return {
              language: trans.language,
              data: flattenJson(JSON.parse(jsonContent)),
            };
          }
        )
      );

      parsedProject.folder_structure.children[0].children.forEach((concept) => {
        concept.translations.forEach((trans) => {
          const langData = loadedTranslations.find(
            (td) => td.language === trans.language
          );
          trans.value = langData?.data[concept.name] || "";
        });
      });

      setParsedProject(parsedProject);
      navigate("/editor");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return {
    saveProject,
    openProject,
  };
};
