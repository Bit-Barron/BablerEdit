import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { flattenJson } from "@/features/translation/lib/parser";
import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useFileManagerStore();

  const addIdToJson = async (value: string) => {
    const translationFiles =
      parsedProject.translation_packages[0].translation_urls;

    // 1. Update all JSON files
    for (let path in translationFiles) {
      const filePath = translationFiles[path].path;
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
      const content = await readTextFile(jsonFilePath);
      const obj = JSON.parse(content);
      const getKey = value.split(".")[0];
      const getValue = value.split(".")[1];

      const entries = Object.entries(obj)
        .map(([key, val]) => ({ key, val }))
        .find((e) => e.key === getKey);

      if (entries && getValue !== "") {
        const addToVal = entries.val as Record<string, unknown>;
        addToVal[getValue] = "";
        obj[getKey] = addToVal;
        const updatedContent = JSON.stringify(obj, null, 2);
        await writeTextFile(jsonFilePath, updatedContent);
      }
    }

    // 2. Reload ALL translations
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

    // 3. Get all keys from the first language (primary)
    const allKeys = Object.keys(loadedTranslations[0].data);

    // 4. Rebuild the entire folder_structure
    const updatedProject: ParsedProject = {
      ...parsedProject,
      folder_structure: {
        ...parsedProject.folder_structure,
        children: [
          {
            ...parsedProject.folder_structure.children[0],
            children: allKeys.map((key) => ({
              type: "folder" as const,
              name: key,
              description: "",
              comment: "",
              translations: loadedTranslations.map((lt) => ({
                language: lt.language,
                value: lt.data[key] || "",
                approved: false,
              })),
            })),
          },
        ],
      },
    };

    // 5. Update state
    setParsedProject(updatedProject);
  };

  return { addIdToJson };
};
