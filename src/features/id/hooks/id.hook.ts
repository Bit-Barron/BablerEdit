import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { flattenJson } from "@/features/translation/lib/parser";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useFileManagerStore();

  const addIdToJson = async (value: string) => {
    const translationFiles =
      parsedProject.translation_packages[0].translation_urls;

    for (let path in translationFiles) {
      const filePath = translationFiles[path].path;

      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
      const content = await readTextFile(jsonFilePath);
      const obj = JSON.parse(content);
      const getKey = value.split(".")[0]; // first part of the id
      const getValue = value.split(".")[1]; // second part of the id

      const entries = Object.entries(obj)
        .map(([key, val]) => ({ key, val }))
        .find((e) => e.key === getKey);

      if (entries && getValue !== "") {
        const addToVal = entries.val as Record<string, unknown>;

        addToVal[getValue] = ""; // add new id with empty string

        obj[getKey] = addToVal; // update the main object

        const updatedContent = JSON.stringify(obj, null, 2);

        await writeTextFile(jsonFilePath, updatedContent);

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

        const updatedProject =
          parsedProject.folder_structure.children[0].children.forEach(
            (concept) => {
              concept.translations.forEach((trans) => {
                const langData = loadedTranslations.find(
                  (td) => td.language === trans.language
                );
                trans.value = langData?.data[concept.name] || "";
              });
            }
          );
        setParsedProject(updatedProject as unknown as ParsedProject);
      }
    }
  };

  return { addIdToJson };
};
