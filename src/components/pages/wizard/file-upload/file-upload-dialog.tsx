import { Plus, Minus, ChevronDown, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/retroui/dialog";
import { MultiFileUpload } from "./file-upload";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/lib/store/project.store";
import { Button } from "@/components/ui/retroui/button";
import * as ProjectService from "@/lib/services/project.service";
import * as FileService from "@/lib/services/file.service";
import { useNotification } from "@/components/elements/toast-notification";
import { useTranslationStore } from "@/lib/store/translation.store";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    selectedFramework,
    setParsedProject,
    setProjectSnapshot,
    primaryLanguageCode,
    setPrimaryLanguageCode,
  } = useProjectStore();
  const { translationFiles, setTranslationFiles } = useTranslationStore();
  const [dialogOpen, setDialogOpen] = useState(open);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  // Auto-select primary language from first uploaded file
  useEffect(() => {
    if (translationFiles.length > 0 && !primaryLanguageCode) {
      const firstLang = translationFiles[0].name.split(".")[0];
      setPrimaryLanguageCode(firstLang);
    }
  }, [translationFiles, primaryLanguageCode, setPrimaryLanguageCode]);

  // Clear selected file if it no longer exists in the list
  useEffect(() => {
    if (selectedFile && !translationFiles.some((f) => f.name === selectedFile)) {
      setSelectedFile(null);
    }
  }, [translationFiles, selectedFile]);

  const navigate = useNavigate();

  const langCodes = translationFiles.map((f) => f.name.split(".")[0]);

  const handleAddLanguage = async () => {
    try {
      const result = await FileService.selectJsonFiles();
      if (!result) return;

      const existingNames = new Set(translationFiles.map((f) => f.name));
      const newFiles = result.files.filter((f) => !existingNames.has(f.name));

      if (newFiles.length === 0) {
        addNotification({
          type: "warning",
          title: "No new files",
          description: "All selected files are already in the list.",
        });
        return;
      }

      setTranslationFiles([...translationFiles, ...newFiles]);

      addNotification({
        type: "success",
        title: "Files added",
        description: `Added ${newFiles.length} language file${newFiles.length > 1 ? "s" : ""}.`,
      });
    } catch (err) {
      console.error("Error adding language files:", err);
      addNotification({
        type: "error",
        title: "Failed to add files",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleRemoveLanguage = () => {
    if (!selectedFile) return;

    const removedLang = selectedFile.split(".")[0];
    const updated = translationFiles.filter((f) => f.name !== selectedFile);
    setTranslationFiles(updated);
    setSelectedFile(null);

    // If the removed file was the primary language, reset it
    if (removedLang === primaryLanguageCode) {
      if (updated.length > 0) {
        setPrimaryLanguageCode(updated[0].name.split(".")[0]);
      } else {
        setPrimaryLanguageCode("");
      }
    }
  };

  const canRemove = selectedFile !== null && translationFiles.length > 1;

  const parseProject = async () => {
    try {
      if (translationFiles.length === 0) {
        addNotification({
          type: "warning",
          title: "No files selected",
          description: "Please upload at least one translation file.",
        });
        return;
      }

      if (!primaryLanguageCode) {
        addNotification({
          type: "warning",
          title: "No primary language",
          description: "Please select a primary language.",
        });
        return;
      }

      const project = await ProjectService.createProject({
        files: translationFiles,
        framework: selectedFramework!,
        primaryLanguage: primaryLanguageCode,
      });

      if (!project) return;

      setProjectSnapshot(project.project);
      setParsedProject(project.project);

      addNotification({
        type: "success",
        title: "Project created",
        description: "Project has been created successfully.",
      });

      navigate("/editor");
      setDialogOpen(false);
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating project:", err);
      addNotification({
        type: "error",
        title: "Failed to create project",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(v) => {
        setDialogOpen(v);
        onOpenChange(v);
      }}
    >
      <Dialog.Content size="md">
        <Dialog.Header className="px-4 pt-4 pb-2 shrink-0 ">
          Configure languages
        </Dialog.Header>

        <div className="px-4 pt-2 pb-4 overflow-y-auto flex-1 min-h-0 bg-background">
          <section className="flex justify-center items-center">
            <MultiFileUpload
              files={translationFiles}
              onFilesChange={setTranslationFiles}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          </section>

          <div className="mt-1.5 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Primary Language
            </label>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm border-2 border-border rounded hover:border-foreground/40 transition-all cursor-pointer bg-background"
            >
              <span className={primaryLanguageCode ? "text-foreground" : "text-muted-foreground"}>
                {primaryLanguageCode || "Select primary language..."}
              </span>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {langDropdownOpen && langCodes.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg p-1">
                {langCodes.map((code) => (
                  <div
                    key={code}
                    onClick={() => {
                      setPrimaryLanguageCode(code);
                      setLangDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <span>{code}</span>
                    {primaryLanguageCode === code && <Check size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleAddLanguage}
            >
              <Plus className="h-4 w-4" />
              Add language
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!canRemove}
              onClick={handleRemoveLanguage}
            >
              <Minus className="h-4 w-4" />
              Remove language
            </Button>
          </div>
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDialogOpen(false);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={parseProject} disabled={!primaryLanguageCode}>Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
