import { ParsedProject } from "@/features/translation/types/translation.types";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import yaml from "js-yaml";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "@/features/file-manager/store/file-manager.store";
import { ProjectHelper } from "../lib/project-helper";
import { toast } from "sonner";
import dayjs from "dayjs";

export const useEditorHook = () => {
  const { addRecentProject } = useSettingsStore();
  const { setParsedProject } = useFileManagerStore();
  const { setCurrentProjectPath, currentProjectPath } = useFileManagerStore();
  const navigate = useNavigate();

  const saveProject = async (
    project: ParsedProject
  ): Promise<ParsedProject | null> => {
    try {
      if (!currentProjectPath) {
        const saveFile = await save({
          defaultPath: project.filename || "Project.babler",
          filters: [
            {
              name: "BablerEdit Project",
              extensions: ["babler"],
            },
          ],
        });

        if (!saveFile) return null;

        setCurrentProjectPath(saveFile);

        const bablerProject = ProjectHelper(project);

        const yamlContent = yaml.dump(bablerProject, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });

        await writeTextFile(saveFile, yamlContent);

        addRecentProject({
          path: saveFile,
          name: project.filename,
          framework: project.framework,
          language: project.primary_language,
        });

        toast.success("Project saved successfully");

        return bablerProject;
      } else {
        const bablerProject = ProjectHelper(project); // Ensure project is in Babler format

        const yamlContent = yaml.dump(bablerProject, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });

        await writeTextFile(currentProjectPath, yamlContent);

        addRecentProject({
          path: currentProjectPath,
          name: project.filename,
          framework: project.framework,
          language: project.primary_language,
          lastModified: dayjs().toISOString(),
        });

        toast.success("Project saved successfully");

        return bablerProject;
      }
    } catch (err) {
      toast.error("Error saving project");
      return null;
    }
  };

  const openProject = async () => {
    try {
      const openFile = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            extensions: ["babler"],
            name: "BablerEdit Project",
          },
        ],
      });

      if (!openFile) return;
      setCurrentProjectPath(openFile); // set the current project path

      const fileContent = await readTextFile(openFile);
      const parsedProject = yaml.load(fileContent);

      setParsedProject(parsedProject as ParsedProject);
      navigate("/editor");
    } catch (err) {
      toast.error("Error opening project");
    }
  };

  return {
    saveProject,
    openProject,
  };
};
