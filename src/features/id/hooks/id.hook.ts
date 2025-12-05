import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { updateProjectFolderStructure } from "../lib/update-structure";
import parseJson from "parse-json";
import { ParsedProject } from "@/features/translation/types/translation.types";

export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useFileManagerStore();
  const { selectedNode } = useEditorStore();

  const TRANSLATION_FILES =
    parsedProject.translation_packages[0].translation_urls;

  const addIdToJson = async (value: string) => {
    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path; // Translation file path
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`; // full path to the translation JSON files
      const content = await readTextFile(jsonFilePath); // Read the content of the translation JSON file
      const obj = parseJson(content); // Parse the JSON content
      const getKey = value.split(".")[0]; // Extract the key from the value
      const getValue = value.split(".")[1]; // Extract the subkey from the value (after the dot)

      const entries = Object.entries(obj) // Convert object to array of entries
        .map(([key, val]) => ({ key, val })) // Map entries to objects with key and val properties
        .find((e) => e.key === getKey); // Find the entry with the matching key

      if (entries && getValue !== "") {
        const addToVal = entries.val as Record<string, unknown>; // Get the values of the object
        addToVal[getValue] = ""; // Add the new subkey with an empty string as value
        obj[getKey] = addToVal as typeof entries.val; // Update the original object with the modified values
        const updatedContent = JSON.stringify(obj, null, 2); // Convert the updated object back to JSON string
        await writeTextFile(jsonFilePath, updatedContent); // Write the updated content back to the file
      }
    }

    const updatedProject = await updateProjectFolderStructure(parsedProject); // Update the project folder structure
    setParsedProject(updatedProject as ParsedProject); // Update the parsed project in the store

    return updatedProject;
  };

  const removeIdFromJson = async () => {
    if (!parsedProject || !selectedNode) return null;
    const TRANSLATION_FILES =
      parsedProject.translation_packages[0].translation_urls;

    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path;
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
      const content = await readTextFile(jsonFilePath);
      const obj = parseJson(content);
      const getKey = selectedNode.data.id.split(".")[0];
      const getValue = selectedNode.data.id.split(".")[1];

      const entries = Object.entries(obj)
        .map(([key, val]) => ({ key, val }))
        .find((e) => e.key === getKey);

      if (entries && getValue !== "") {
        const removeFromVal = entries.val as Record<string, unknown>; // Get the values of the object
        delete removeFromVal[getValue]; // Remove the subkey from the values
        obj[getKey] = removeFromVal as typeof entries.val; // Update the original object with the modified values
        const updatedContent = JSON.stringify(obj, null, 2); // Convert the updated object back to JSON string
        await writeTextFile(jsonFilePath, updatedContent); // Write the updated content back to the file
      }
    }

    const updatedProject = await updateProjectFolderStructure(parsedProject); // Update the project folder structure
    setParsedProject(updatedProject as ParsedProject); // Update the parsed project in the store

    return updatedProject;
  };

  return { addIdToJson, removeIdFromJson };
};
