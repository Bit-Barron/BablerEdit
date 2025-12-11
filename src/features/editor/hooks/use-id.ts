import { useProjectStore } from "@/features/project/store/project.store";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { updateProjectFolderStructure } from "../lib/update-structure";
import parseJson from "parse-json";
import { ParsedProject } from "@/features/project/types/project.types";
import { toast } from "sonner";
import { readTranslationFile } from "@/features/project/lib/read-file";

export const useIdHook = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { selectedNode } = useEditorStore();

  const addIdToJson = async (value: string) => {
    try {
      const TRANSLATION_FILES =
        parsedProject.translation_packages[0].translation_urls;

      for (let path in TRANSLATION_FILES) {
        const filePath = TRANSLATION_FILES[path].path;
        const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
        const content = await readTextFile(jsonFilePath);
        const obj = parseJson(content);
        const splitSelectedNode = selectedNode!.data.id.split(".");
        let current: any = obj;
        let parrent: any = "";

        for (let i = 0; i < splitSelectedNode.length; i++) {
          parrent = current;
          current = current[splitSelectedNode[i]];
        }

        if (typeof current === "object") {
          current[value] = "";
        } else {
          parrent[value] = "";
        }
        const updateContent = JSON.stringify(obj, null, 2);
        writeTextFile(jsonFilePath, updateContent);
      }

      const updatedProject = await updateProjectFolderStructure(parsedProject);

      toast.success(`ID "${value}" added successfully to JSON files`);
      setParsedProject(updatedProject as ParsedProject);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);

      return null;
    }
  };

  const removeIdFromJson = async () => {
    try {
      const TRANSLATION_FILES =
        parsedProject.translation_packages[0].translation_urls;

      for (let path in TRANSLATION_FILES) {
        const filePath = TRANSLATION_FILES[path].path;
        const jsonFilePath = `${parsedProject.source_root_dir}${filePath}`;
        const obj = await readTranslationFile(
          parsedProject.source_root_dir,
          filePath
        );

        const splitSelectedNode = selectedNode!.data.id.split(".");

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

      toast.success(
        `ID "${selectedNode!.data.name}" removed successfully from JSON files`
      );
      setParsedProject(updatedProject as ParsedProject);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed: ${message}`);

      return null;
    }
  };

  return { addIdToJson, removeIdFromJson };
};
