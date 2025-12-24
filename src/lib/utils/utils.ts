import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSourceRootDir = (filePath: string): string => {
  return (
    filePath.substring(0, filePath.lastIndexOf("/") + 1) ||
    filePath.substring(0, filePath.lastIndexOf("\\") + 1) ||
    "/"
  );
}; // example: /path/to/project/file.json -> /path/to/project/
