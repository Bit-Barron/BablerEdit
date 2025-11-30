import { Upload } from "lucide-react";

interface DropzoneContentProps {
  config: {
    name: string;
    acceptedExtensions: string[];
    maxFiles: number;
  };
  maxSizeInMB: number;
}

export function DropzoneContent({ config, maxSizeInMB }: DropzoneContentProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-center justify-center rounded-full border p-2.5">
        <Upload className="size-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-sm">
        Drag & drop {config.name} files here
      </p>
      <p className="text-muted-foreground text-xs">
        Accepted: {config.acceptedExtensions.join(", ")} (max {config.maxFiles}{" "}
        files, up to {maxSizeInMB}MB each)
      </p>
    </div>
  );
}
