"use client";

import { Button } from "@/core/components/ui/button";
import { X } from "lucide-react";
import { Upload } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { useFileManagerStore } from "../store/file-manager.store";

export function FileUploadDropzone() {
  const { translationFiles, setTranslationFiles } = useFileManagerStore();

  const handleBrowseFiles = async () => {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: "Translation Files",
          extensions: ["json"],
        },
      ],
    });

    if (!selected) return;

    const paths = Array.isArray(selected) ? selected : [selected];

    const filesWithPaths = await Promise.all(
      paths.map(async (path) => {
        const content = await readTextFile(path);
        const fileName = path.split("/").pop() || path.split("\\").pop() || "";

        console.log("TESTTT", path);
        return {
          name: fileName,
          path: path,
          content: content,
          size: content.length,
        };
      })
    );

    setTranslationFiles(filesWithPaths as any);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6">
        <div className="flex items-center justify-center rounded-full border p-2.5">
          <Upload className="size-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">Select translation files</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={handleBrowseFiles}
        >
          Browse files
        </Button>
      </div>

      {translationFiles.length > 0 && (
        <div className="space-y-2">
          {translationFiles.map((file: any, index: number) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2.5 rounded-md border p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {file.path}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => {
                  setTranslationFiles(
                    translationFiles.filter((f: any) => f.path !== file.path)
                  );
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
