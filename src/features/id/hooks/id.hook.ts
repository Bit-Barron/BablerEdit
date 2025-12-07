import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { updateProjectFolderStructure } from "../lib/update-structure";
import parseJson from "parse-json";
import { ParsedProject } from "@/features/translation/types/translation.types";

export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useFileManagerStore();
  const { selectedNode } = useEditorStore();

  const addIdToJson = async (value: string) => {
    const TRANSLATION_FILES =
      parsedProject.translation_packages[0].translation_urls;

    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path;
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
      const content = await readTextFile(jsonFilePath);
      const obj = parseJson(content);
      const splitSelectedNode = selectedNode.data.id.split(".");
      let current: any = obj;
      let parrent: any = "";

      for (let i = 0; i < splitSelectedNode.length; i++) {
        current = current[splitSelectedNode[i]];

        if (typeof current === "object") {
          parrent = current;
          current[value] = "";
        }
        parrent[value[i]];
      }

      const updateContent = JSON.stringify(obj, null, 2);
      writeTextFile(jsonFilePath, updateContent);
    }

    const updatedProject = await updateProjectFolderStructure(parsedProject);
    setParsedProject(updatedProject as ParsedProject);
  };

  const removeIdFromJson = async () => {
    const TRANSLATION_FILES =
      parsedProject.translation_packages[0].translation_urls;

    for (let path in TRANSLATION_FILES) {
      const filePath = TRANSLATION_FILES[path].path;
      const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
      const content = await readTextFile(jsonFilePath);
      const obj = parseJson(content);

      const splitSelectedNode = selectedNode.data.id.split(".");

      let current: any = obj;
      let parrent: any = "";

      for (let i = 0; i < splitSelectedNode.length; i++) {
        parrent = current;
        current = current[splitSelectedNode[i]];
      }

      delete parrent[splitSelectedNode[splitSelectedNode.length - 1]];
      const updatedContent = JSON.stringify(obj, null, 2);

      writeTextFile(jsonFilePath, updatedContent);
    }
    const updatedProject = await updateProjectFolderStructure(parsedProject);
    setParsedProject(updatedProject as ParsedProject);
  };

  return { addIdToJson, removeIdFromJson };
};
