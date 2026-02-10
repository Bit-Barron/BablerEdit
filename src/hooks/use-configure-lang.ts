import { useProjectStore } from "@/lib/store/project.store";
import * as ProjectService from "@/lib/services/project.service"
import { open } from "@tauri-apps/plugin-dialog";
import { useNotification } from "@/components/elements/toast-notification";
import { ParsedProject } from "@/lib/types/project.types";
import { useEditorStore } from "@/lib/store/editor.store";

export const useConfigureLang = () => {
  const { parsedProject, setParsedProject, projectSnapshot } = useProjectStore();
  const { addNotification } = useNotification()
  const {
    setLanguageToAdd,
    setTranslationId,
    setTranslationText,
    translationId,
    translationText,
    translationTextStatus,
    approvalStateStatus,
    languageToAdd,
    setApprovalStateStatus,
    setTranslationTextStatus,
    setUsageStatus,
  } = useEditorStore()

  const addPathTolanguage = async (locale: string) => {
    const openFile = await open({
      multiple: false,
      directory: false,
      filters: [{ extensions: ["json"], name: "Translaiton Json" }],
    });

    if (!openFile) return;

    const splitLocale = openFile.split("/").pop()

    if (!splitLocale) return;

    const checkIfFileAlreadyExist = parsedProject.translation_packages.some((t) => {
      return t.translation_urls.find((t) => t.path === splitLocale)
    })

    if (checkIfFileAlreadyExist) {
      addNotification({
        title: "Translation Json already Exist",
        type: "error",
      })
      return;
    }

    const translationPackages = parsedProject.translation_packages.map((t) => ({
      ...t,
      translation_urls: [
        ...t.translation_urls,
        { path: splitLocale, language: splitLocale.split(".")[0] }
      ]
    }));

    const updatedLanguages = [
      ...parsedProject.languages,
      { code: splitLocale.split(".")[0] }
    ]

    const updatedFolderStructure: ParsedProject
      = {
      ...parsedProject,
      languages: updatedLanguages,
      translation_packages: translationPackages
    }

    const result = await ProjectService.updateProjectFolderStructure({
      project: updatedFolderStructure,
    });
    setLanguageToAdd(languageToAdd.filter((l) => l !== locale));
    setParsedProject(result.updatedProject)
  }

  const handleDelete = async (locale: string) => {

    const splitLocale = locale.split("/").pop()

    const filterLocale = parsedProject.languages.filter((locale) => locale.code !== splitLocale)
    const filterTranslationPackages = parsedProject.translation_packages[0].translation_urls.filter(
      (lang) => lang.language !== splitLocale
    )
    const buildTranslationPackage = {
      name: "main",
      translation_urls: filterTranslationPackages
    }

    const updatedFolderStructure: ParsedProject = {
      ...parsedProject,
      languages: filterLocale,
      translation_packages: [buildTranslationPackage]
    }

    const result = await ProjectService.updateProjectFolderStructure({
      project: updatedFolderStructure,
    });

    setParsedProject(result.updatedProject)
  }


  const handleFilter = async () => {
    // Use the snapshot (original unfiltered data) as the source, not the current (possibly already filtered) project
    const sourceProject = projectSnapshot && Object.keys(projectSnapshot).length > 0
      ? projectSnapshot
      : parsedProject;

    const allConcepts = sourceProject.folder_structure.children[0].children;

    const filtered = allConcepts.filter((concept) => {
      // Filter by Translation ID substring
      if (translationId && translationId.trim() !== "") {
        if (!concept.name.toLowerCase().includes(translationId.toLowerCase())) {
          return false;
        }
      }

      // Filter by Translation text substring (search across all language values)
      if (translationText && translationText.trim() !== "") {
        const hasMatch = concept.translations.some((t) =>
          t.value.toLowerCase().includes(translationText.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      // Filter by translation text status
      if (translationTextStatus === "translated") {
        const allTranslated = concept.translations.every((t) => t.value && t.value.trim() !== "");
        if (!allTranslated) return false;
      } else if (translationTextStatus === "untranslated") {
        const hasEmpty = concept.translations.some((t) => !t.value || t.value.trim() === "");
        if (!hasEmpty) return false;
      }

      // Filter by approval state
      if (approvalStateStatus === "approved") {
        const allApproved = concept.translations.every((t) => t.approved);
        if (!allApproved) return false;
      } else if (approvalStateStatus === "not-approved") {
        const hasUnapproved = concept.translations.some((t) => !t.approved);
        if (!hasUnapproved) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      addNotification({
        title: "No results",
        description: "No translations match the current filter.",
        type: "info"
      });
      return;
    }

    const updatedFolder: ParsedProject = {
      ...parsedProject,
      folder_structure: {
        ...parsedProject.folder_structure,
        children: parsedProject.folder_structure.children.map((pkg) => ({
          ...pkg,
          children: filtered
        }))
      }
    }

    setParsedProject(updatedFolder)

    addNotification({
      title: "Filter applied",
      description: `Showing ${filtered.length} of ${allConcepts.length} translations.`,
      type: "success"
    });
  }

  const handleReset = () => {
    // Clear form inputs
    setTranslationId("")
    setTranslationText("")
    setTranslationTextStatus("any")
    setApprovalStateStatus("any")
    setUsageStatus("any")

    // Restore original unfiltered project data from snapshot
    if (projectSnapshot && Object.keys(projectSnapshot).length > 0) {
      setParsedProject(projectSnapshot);
      addNotification({
        title: "Filter cleared",
        description: "Showing all translations.",
        type: "success"
      });
    }
  }

  return {
    addPathTolanguage,
    handleDelete,
    handleFilter,
    handleReset
  }
}
