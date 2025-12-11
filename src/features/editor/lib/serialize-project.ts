import { ParsedProject } from "@/features/project/types/project.types";

export const ProjectHelper = (project: ParsedProject) => {
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

  return bablerProject;
};
