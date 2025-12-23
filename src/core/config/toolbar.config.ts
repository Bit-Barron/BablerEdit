import { ToolbarType } from "../types/common.types";
import { FoldersIcon } from "@/core/components/icons/folders";
import { HardDriveDownloadIcon } from "@/core/components/icons/hard-drive-download";
import { PlusIcon } from "@/core/components/icons/plus";
import { DeleteIcon } from "@/core/components/icons/delete";
import { SlidersHorizontalIcon } from "@/core/components/icons/sliders-horizontal";
import { BotIcon } from "@/core/components/icons/bot";
import { EarthIcon } from "@/core/components/icons/earth";

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
    id: "consistency",
    icon: BotIcon,
    label: "ConsistencyAI",
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
