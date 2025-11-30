"use client";

import { Button } from "@/core/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/core/components/ui/file-upload";
import { X } from "lucide-react";
import { DropzoneContent } from "./framework-dropzone-content";
import { useFrameworkDropzone } from "../hooks/use-framework";

export function FrameworkDropzone() {
  const {
    config,
    translationFiles,
    acceptedTypes,
    maxSizeInMB,
    handleFilesChange,
    handleFileDelete,
    onFileReject,
  } = useFrameworkDropzone();

  if (!config) return null;

  return (
    <FileUpload
      maxFiles={config.maxFiles}
      maxSize={config.maxSize}
      accept={acceptedTypes}
      className="w-full"
      value={translationFiles}
      onValueChange={handleFilesChange}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <DropzoneContent config={config} maxSizeInMB={maxSizeInMB} />
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList>
        {translationFiles.map((file, index) => (
          <FileUploadItem
            key={`${file.name}-${file.size}-${index}`}
            value={file}
          >
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={handleFileDelete(file)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
