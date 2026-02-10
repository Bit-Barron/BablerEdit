import { ToolbarType } from "@/lib/types/config.types";
import { FoldersIcon } from "@/components/icons/folders";
import { HardDriveDownloadIcon } from "@/components/icons/hard-drive-download";
import { PlusIcon } from "@/components/icons/plus";
import { DeleteIcon } from "@/components/icons/delete";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { EarthIcon } from "@/components/icons/earth";
import { LanguagesIcon } from "@/components/icons/languages";
export const TOOLBAR: ToolbarType[] = [
  {
    id: "open",
    icon: FoldersIcon,
    label: "Open project",
    onClick: "onOpenProject",
    enabledIn: ["/", "/wizard"],
    disabled: false,
  },
  {
    id: "save",
    icon: HardDriveDownloadIcon,
    label: "Save project",
    onClick: "onSaveProject",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "add-id",
    icon: PlusIcon,
    label: "Add ID",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "remove-ids",
    icon: DeleteIcon,
    label: "Remove IDs",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "filter",
    icon: SlidersHorizontalIcon,
    label: "Set Filter",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "pre-translate",
    icon: LanguagesIcon,
    label: "Pre-Translate",
    enabledIn: ["/editor"],
    disabled: false,
  },
  {
    id: "languages",
    icon: EarthIcon,
    label: "Languages",
    enabledIn: ["/editor"],
    disabled: false,
  },
];
