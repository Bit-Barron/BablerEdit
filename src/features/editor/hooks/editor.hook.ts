import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { flattenJson } from "@/features/translation/lib/parser";
import { ProjectHelper } from "../lib/project-helper";

export const useEditorHook = () => {
  const { addRecentProject } = useSettingsStore();
  const { setParsedProject } = useFileManagerStore();
  const navigate = useNavigate();

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | void> => {
    try {
      const saveFile = await save({
        defaultPath: project.filename || "Project.babler",
        filters: [
          {
            name: "BablerEdit Project",
            extensions: ["babler"],
          },
        ],
      });

      if (!saveFile) return;

      const bablerProject = ProjectHelper(project);

      const yamlContent = yaml.dump(bablerProject, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
      });

      await writeTextFile(saveFile, yamlContent);

      addRecentProject({
        path: saveFile,
        name: project.filename,
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
