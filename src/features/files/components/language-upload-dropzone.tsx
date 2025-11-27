// src/features/files/components/language-upload-dropzone.tsx
"use client";

import { Button } from "@/shared/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/shared/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import { useFilesStore } from "../store/file-store";
import { useMemo } from "react";
import { getFrameworkConfig } from "@/shared/lib/framework-config";

export function FrameworkDropzone() {
  const {
    translationFiles,
    validateAndAddFiles,
    selectedFramework,
    onFileReject,
  } = useFilesStore();

  const config = useMemo(() => {
    if (!selectedFramework) return null;
    return getFrameworkConfig(selectedFramework);
  }, [selectedFramework]);

  if (!config) return null;

  const acceptedTypes = config.acceptedExtensions.join(",");

  return (
    <FileUpload
      maxFiles={config.maxFiles}
      maxSize={config.maxSize}
      accept={acceptedTypes}
      className="w-full"
      value={translationFiles}
      onValueChange={async (files) => {
        await validateAndAddFiles(files);
      }}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">
            Drag & drop {config.name} files here
          </p>
          <p className="text-muted-foreground text-xs">
            Accepted: {config.acceptedExtensions.join(", ")} (max{" "}
            {config.maxFiles} files, up to {config.maxSize / 1024 / 1024}MB
            each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {translationFiles.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
