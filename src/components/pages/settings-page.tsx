import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/lib/store/setting.store";
import { useTheme } from "@/components/providers/theme-provider";
import {
  COLOR_SCHEMES,
  BORDER_RADIUS_OPTIONS,
  FONT_OPTIONS,
} from "@/lib/config/design.config";
import { Button } from "@/components/ui/retroui/button";
import {
  createAnimation,
  getRandomAnimation,
} from "@/components/elements/toggles/theme-animation";
import { ArrowLeft, Sun, Moon, Monitor, Check, Keyboard } from "lucide-react";
import { useCallback } from "react";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { designSettings, setDesignSetting } = useSettingsStore();

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      const styleId = "theme-transition-styles";
      const { variant, start } = getRandomAnimation();
      const animation = createAnimation(variant, start);

      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = animation.css;

      if (!document.startViewTransition) {
        setTheme(newTheme);
        return;
      }
      document.startViewTransition(() => setTheme(newTheme));
    },
    [setTheme]
  );

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
            Settings
          </h1>
        </div>

        {/* Theme */}
        <Section title="Theme">
          <div className="grid grid-cols-3 gap-3">
            <ThemeCard
              icon={<Sun size={20} />}
              label="Light"
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
            />
            <ThemeCard
              icon={<Moon size={20} />}
              label="Dark"
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
            />
            <ThemeCard
              icon={<Monitor size={20} />}
              label="System"
              active={theme === "system"}
              onClick={() => handleThemeChange("system")}
            />
          </div>
        </Section>

        {/* Color Scheme */}
        <Section title="Color Scheme">
          <div className="grid grid-cols-3 gap-3">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setDesignSetting("colorScheme", scheme.id)}
                className={`relative flex items-center gap-3 p-3 rounded border-2 cursor-pointer transition-all ${
                  designSettings.colorScheme === scheme.id
                    ? "border-foreground bg-secondary/20"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-foreground/20 shrink-0"
                  style={{ backgroundColor: scheme.swatch }}
                />
                <span className="text-sm font-medium">{scheme.label}</span>
                {designSettings.colorScheme === scheme.id && (
                  <Check size={14} className="absolute top-2 right-2 text-foreground" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* Border Radius */}
        <Section title="Border Radius">
          <div className="grid grid-cols-4 gap-3">
            {BORDER_RADIUS_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setDesignSetting("borderRadius", option.id)}
                className={`flex flex-col items-center gap-2 p-4 border-2 cursor-pointer transition-all ${
                  designSettings.borderRadius === option.id
                    ? "border-foreground bg-secondary/20"
                    : "border-border hover:border-foreground/40"
                }`}
                style={{ borderRadius: option.value }}
              >
                <div
                  className="w-10 h-10 border-2 border-foreground bg-primary"
                  style={{ borderRadius: option.value }}
                />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Font */}
        <Section title="Font">
          <div className="grid grid-cols-2 gap-3">
            {FONT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setDesignSetting("font", option.id)}
                className={`flex flex-col items-start gap-1 p-4 rounded border-2 cursor-pointer transition-all ${
                  designSettings.font === option.id
                    ? "border-foreground bg-secondary/20"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: option.fontHead }}
                >
                  {option.label}
                </span>
                <span
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: option.fontSans }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* Animations */}
        <Section title="Animations">
          <button
            onClick={() =>
              setDesignSetting("dialogShake", !designSettings.dialogShake)
            }
            className={`flex items-center justify-between w-full p-4 rounded border-2 cursor-pointer transition-all ${
              designSettings.dialogShake
                ? "border-foreground bg-secondary/20"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-bold">Dialog Shake</span>
              <span className="text-xs text-muted-foreground">
                Shake dialog when clicking outside of it
              </span>
            </div>
            <div
              className={`w-10 h-6 rounded-full border-2 border-foreground/20 relative transition-all ${
                designSettings.dialogShake ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${
                  designSettings.dialogShake ? "left-4" : "left-0.5"
                }`}
              />
            </div>
          </button>
        </Section>

        {/* Keyboard Shortcuts */}
        <Section title="Keyboard Shortcuts">
          <button
            onClick={() => navigate("/settings/shortcuts")}
            className="flex items-center justify-between w-full p-4 rounded border-2 border-border hover:border-foreground/40 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <Keyboard size={20} className="text-muted-foreground" />
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-bold">View All Shortcuts</span>
                <span className="text-xs text-muted-foreground">
                  See all keyboard shortcuts for the editor
                </span>
              </div>
            </div>
            <ArrowLeft size={16} className="rotate-180 text-muted-foreground" />
          </button>
        </Section>

        {/* Preview */}
        <Section title="Preview">
          <div className="border-2 border-border rounded p-6 space-y-4 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-head text-sm font-bold">Sample Header</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is how your editor content will look with the current design settings applied.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-8">
    <h2 className="font-head text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const ThemeCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-2 p-4 rounded border-2 cursor-pointer transition-all ${
      active
        ? "border-foreground bg-secondary/20"
        : "border-border hover:border-foreground/40"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    {active && <Check size={14} className="absolute top-2 right-2" />}
  </button>
);
