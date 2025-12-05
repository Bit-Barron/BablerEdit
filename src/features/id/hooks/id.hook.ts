import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { updateProjectFolderStructure } from "../lib/update-structure";
import parseJson from "parse-json";

export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useFileManagerStore();
  const { selectedNode } = useEditorStore();
  const TRANSLATION_FILES =
    parsedProject!.translation_packages[0]!.translation_urls;

  const addIdToJson = async (value: string) => {
    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path; // Get the path of the translation file
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`; // Build the full Language File path
      const content = await readTextFile(jsonFilePath); // Get the content of the Language Files(all languages)
      const obj = JSON.parse(content); // Parse the content to JSON object
      const getKey = value.split(".")[0]; // Get the key from the id
      const getValue = value.split(".")[1]; // Get the value from the id

      const entries = Object.entries(obj) // Get the entries of the JSON object
        .map(([key, val]) => ({ key, val }))
        .find((e) => e.key === getKey);

      if (entries && getValue !== "") {
        const addToVal = entries.val as Record<string, unknown>; // Object Values
        addToVal[getValue] = ""; // Add the new key with empty string
        obj[getKey] = addToVal; // Update the main object with the new value
        const updatedContent = JSON.stringify(obj, null, 2); // Update the content with stringify
        await writeTextFile(jsonFilePath, updatedContent); // Write the updated content to the file
      }
    }

    const updatedProject = await updateProjectFolderStructure(parsedProject);

    setParsedProject(updatedProject);

    return updatedProject;
  };

  const removeIdFromJson = async () => {
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
        const removeFromVal = entries.val as Record<string, unknown>; // Object Values
        delete removeFromVal[getValue]; // Remove the key from the object
        obj[getKey] = removeFromVal as typeof entries.val; // Update the main object with the new value
        const updatedContent = JSON.stringify(obj, null, 2); // Update the content with stringify
        await writeTextFile(jsonFilePath, updatedContent); // Write the updated content to the file
      }
      const updatedProject = await updateProjectFolderStructure(parsedProject);

      setParsedProject(updatedProject);

      return updatedProject;
    }
  };
  return { addIdToJson, removeIdFromJson };
};
