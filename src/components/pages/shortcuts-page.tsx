import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/retroui/button";
import { ArrowLeft } from "lucide-react";
import { SHORTCUTS, SHORTCUT_CATEGORIES } from "@/lib/config/shortcuts.config";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

function formatKeyCombo(keys: string): string[] {
  return keys.split("+").map((part) => {
    const p = part.toLowerCase();
    if (p === "mod") return isMac ? "\u2318" : "Ctrl";
    if (p === "shift") return "Shift";
    if (p === "alt") return isMac ? "\u2325" : "Alt";
    if (p === "delete") return "Del";
    if (p === "f2") return "F2";
    if (p === "=") return "+";
    if (p === "-") return "\u2013";
    if (p === ",") return ",";
    return p.toUpperCase();
  });
}

export const ShortcutsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 top-22 bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-head text-2xl font-bold tracking-tight">
            Keyboard Shortcuts
          </h1>
        </div>

        {SHORTCUT_CATEGORIES.map((category) => {
          const items = SHORTCUTS.filter((s) => s.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="font-head text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                {category}
              </h2>
              <div className="border-2 border-border rounded divide-y divide-border">
                {items.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm">{shortcut.label}</span>
                    <div className="flex items-center gap-1">
                      {formatKeyCombo(shortcut.keys).map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && (
                            <span className="text-xs text-muted-foreground">
                              +
                            </span>
                          )}
                          <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-medium bg-secondary border border-border rounded">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
