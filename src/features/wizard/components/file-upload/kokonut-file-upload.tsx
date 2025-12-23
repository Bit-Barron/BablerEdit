"use client";

import { UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type DragEvent, useCallback, useEffect, useState } from "react";
import { cn } from "@/core/lib/utils";
import { FileWithPath } from "@/features/project/types/file.types";
import { useFileManager } from "@/features/wizard/hooks/use-file-manager";
import { listen } from "@tauri-apps/api/event";
import { readTextFile } from "@tauri-apps/plugin-fs";

type FileStatus = "idle" | "dragging";

interface MultiFileUploadProps {
  files: FileWithPath[];
  onFilesChange: (files: FileWithPath[]) => void;
  className?: string;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const UploadIllustration = () => (
  <div className="relative h-16 w-16">
    <svg
      aria-label="Upload illustration"
      className="h-full w-full"
      fill="none"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Upload File Illustration</title>
      <circle
        className="stroke-gray-200 dark:stroke-gray-700"
        cx="50"
        cy="50"
        r="45"
        strokeDasharray="4 4"
        strokeWidth="2"
      >
        <animateTransform
          attributeName="transform"
          dur="60s"
          from="0 50 50"
          repeatCount="indefinite"
          to="360 50 50"
          type="rotate"
        />
      </circle>

      <path
        className="fill-blue-100 stroke-blue-500 dark:fill-blue-900/30 dark:stroke-blue-400"
        d="M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
        strokeWidth="2"
      >
        <animate
          attributeName="d"
          dur="2s"
          repeatCount="indefinite"
          values="M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z;M30 38H70C75 38 75 43 75 43V68C75 73 70 73 70 73H30C25 73 25 68 25 68V43C25 38 30 38 30 38Z;M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
        />
      </path>

      <path
        className="stroke-blue-500 dark:stroke-blue-400"
        d="M30 35C30 35 35 35 40 35C45 35 45 30 50 30C55 30 55 35 60 35C65 35 70 35 70 35"
        fill="none"
        strokeWidth="2"
      />

      <g className="translate-y-2 transform">
        <line
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeLinecap="round"
          strokeWidth="2"
          x1="50"
          x2="50"
          y1="45"
          y2="60"
        >
          <animate
            attributeName="y2"
            dur="2s"
            repeatCount="indefinite"
            values="60;55;60"
          />
        </line>
        <polyline
          className="stroke-blue-500 dark:stroke-blue-400"
          fill="none"
          points="42,52 50,45 58,52"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <animate
            attributeName="points"
            dur="2s"
            repeatCount="indefinite"
            values="42,52 50,45 58,52;42,47 50,40 58,47;42,52 50,45 58,52"
          />
        </polyline>
      </g>
    </svg>
  </div>
);

export function MultiFileUpload({
  files,
  onFilesChange,
  className,
}: MultiFileUploadProps) {
  const [status, setStatus] = useState<FileStatus>("idle");
  const { selectJsonFiles } = useFileManager();

  // Tauri Drag & Drop Event Listener
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupDragDrop = async () => {
      unlisten = await listen<string[]>("tauri://file-drop", async (event) => {
        const droppedPaths = event.payload;
        const jsonFiles = droppedPaths.filter((p) => p.endsWith(".json"));

        if (jsonFiles.length === 0) {
          console.log("No JSON files dropped");
          return;
        }

        const filesWithPaths = await Promise.all(
          jsonFiles.map(async (path) => {
            const content = await readTextFile(path);
            const fileName = path.split(/[/\\]/).pop() || "";
            return {
              name: fileName,
              path: path,
              content: content,
              size: content.length,
            };
          })
        );

        onFilesChange([...files, ...filesWithPaths]);
        setStatus("idle");
      });
    };

    setupDragDrop();

    return () => {
      if (unlisten) unlisten();
    };
  }, [files, onFilesChange]);

  // Drag Over Event für visuelle Feedback
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupDragOver = async () => {
      unlisten = await listen("tauri://file-drop-hover", () => {
        setStatus("dragging");
      });
    };

    setupDragOver();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Drag Leave Event
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupDragLeave = async () => {
      unlisten = await listen("tauri://file-drop-cancelled", () => {
        setStatus("idle");
      });
    };

    setupDragLeave();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleSelect = async () => {
    const selected = await selectJsonFiles();
    if (selected) {
      onFilesChange(selected);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = (pathToRemove: string) => {
    onFilesChange(files.filter((f) => f.path !== pathToRemove));
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div className="group relative w-full rounded-xl bg-white p-0.5 ring-1 ring-gray-200 dark:bg-black dark:ring-white/10">
        <div className="-top-px absolute inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="relative w-full rounded-[10px] bg-gray-50/50 p-1.5 dark:bg-white/[0.02]">
          <div className="relative mx-auto w-full overflow-hidden rounded-lg bg-white dark:bg-black/50">
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                status === "dragging" ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-blue-500/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-blue-500/10 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-blue-500/10 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-blue-500/10 to-transparent" />
              <div className="absolute inset-[20%] animate-pulse rounded-lg bg-blue-500/5" />
            </div>

            <div className="-right-4 -top-4 absolute h-8 w-8 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            <motion.div
              animate={{
                opacity: status === "dragging" ? 0.8 : 1,
                scale: status === "dragging" ? 0.98 : 1,
              }}
              className="flex flex-col items-center justify-center p-6 min-h-[200px] cursor-pointer"
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleSelect}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 pointer-events-none">
                <UploadIllustration />
              </div>

              <div className="mb-4 space-y-1.5 text-center pointer-events-none">
                <h3 className="font-semibold text-gray-900 text-lg tracking-tight dark:text-white">
                  Drag and drop or click
                </h3>
                <p className="text-gray-500 text-xs dark:text-gray-400">
                  JSON files up to 5 MB
                </p>
              </div>

              <div className="group/btn flex w-4/5 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 font-semibold text-gray-900 text-sm transition-all duration-200 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 pointer-events-none">
                <span>Browse files</span>
                <UploadCloud className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
              </div>

              <p className="mt-3 text-gray-500 text-xs dark:text-gray-400 pointer-events-none">
                Multiple files supported
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {files.map((file: FileWithPath, index: number) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center gap-2.5 rounded-md border border-gray-200 dark:border-white/[0.08] p-3 bg-white dark:bg-black/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {file.path} • {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(file.path)}
                  className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
