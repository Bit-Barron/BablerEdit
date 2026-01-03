import { useProjectStore } from "@/lib/store/project.store";
import * as ProjectService from "@/lib/services/project.service"
import { open } from "@tauri-apps/plugin-dialog";
import { useNotification } from "@/components/elements/toast-notification";
import { ParsedProject } from "@/lib/types/project.types";
import { useEditorStore } from "@/lib/store/editor.store";


export const useConfigureLang = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { addNotification } = useNotification()
  const { setLanguageToAdd, languageToAdd
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

  return {
    addPathTolanguage,
    handleDelete
  }
}
