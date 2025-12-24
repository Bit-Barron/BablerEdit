import { writeTextFile } from "@tauri-apps/plugin-fs";
import { ParsedProject } from "@/lib/types/project.types";
import { toast } from "sonner";
import { updateProjectFolderStructure } from "@/lib/services/project-updater.service";
import { readTranslationFile } from "@/lib/utils/file-reader";
import { useProjectStore } from "@/lib/store/project.store";
import { useSelectionStore } from "@/lib/store/selection.store";

export const useId = () => {
  const { parsedProject, setParsedProject } = useProjectStore();
  const { selectedNode } = useSelectionStore();

  const addIdToJson = async (value: string) => {
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

        if (!selectedNode) return;

        const splitSelectedNode = selectedNode.data.id.split(".");
        let current: any = obj;
        let parent: any = "";

        for (let i = 0; i < splitSelectedNode.length; i++) {
          parent = current;
          current = current[splitSelectedNode[i]];
        }

        if (typeof current === "object") {
          current[value] = "";
        } else {
          parent[value] = "";
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
        let parent: any = "";

        for (let i = 0; i < splitSelectedNode.length; i++) {
          parent = current;
          current = current[splitSelectedNode[i]];
        }

        delete parent[splitSelectedNode[splitSelectedNode.length - 1]];
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
