import {
  FolderOpen,
  Save,
  Plus,
  Trash2,
  Filter,
  Languages,
  Bot,
  Globe,
  Settings,
  FileText,
  Upload,
} from "lucide-react";

interface ToolbarButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface ToolbarProps {
  onOpenProject?: () => void;
  onSaveProject?: () => void;
}

export default function Toolbar({
  onOpenProject,
  onSaveProject,
}: ToolbarProps) {
  const buttons: ToolbarButton[] = [
    {
      id: "open",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Open project",
      onClick: onOpenProject,
    },
    {
      id: "save",
      icon: <Save className="w-5 h-5" />,
      label: "Save project",
      onClick: onSaveProject,
      disabled: true,
    },
    {
      id: "add-id",
      icon: <Plus className="w-5 h-5" />,
      label: "Add ID",
      disabled: true,
    },
    {
      id: "remove-ids",
      icon: <Trash2 className="w-5 h-5" />,
      label: "Remove IDs",
      disabled: true,
    },
    {
      id: "filter",
      icon: <Filter className="w-5 h-5" />,
      label: "Set Filter",
      disabled: true,
    },
    {
      id: "pre-translate",
      icon: <Languages className="w-5 h-5" />,
      label: "Pre-Translate",
      disabled: true,
    },
    {
      id: "consistency",
      icon: <Bot className="w-5 h-5" />,
      label: "ConsistencyAI",
      disabled: true,
    },
    {
      id: "languages",
      icon: <Globe className="w-5 h-5" />,
      label: "Languages",
      disabled: true,
    },
    {
      id: "configuration",
      icon: <Settings className="w-5 h-5" />,
      label: "Configuration",
      disabled: true,
    },
    {
      id: "show-source",
      icon: <FileText className="w-5 h-5" />,
      label: "Show source",
      disabled: true,
    },
    {
      id: "import",
      icon: <Upload className="w-5 h-5" />,
      label: "Import",
      disabled: true,
    },
  ];

  return (
    <div className={`border-b bg-muted/30 `}>
      <div className="flex items-center justify-center h-[60px] px-2 gap-0.5 overflow-x-auto">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={button.onClick}
            disabled={button.disabled}
            className={`
              flex flex-col items-center justify-center 
              gap-1 px-3 py-2 rounded-sm 
              transition-colors min-w-[72px]
              ${
                button.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-accent cursor-pointer"
              }
            `}
            title={button.label}
          >
            <div className={button.disabled ? "text-muted-foreground" : ""}>
              {button.icon}
            </div>
            <span
              className={`text-[10px] leading-tight text-center ${
                button.disabled ? "text-muted-foreground" : ""
              }`}
            >
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
