import { SHORTCUTS } from "@/lib/config/shortcuts.config";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

interface ParsedKeys {
  mod: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

function parseKeys(keys: string): ParsedKeys {
  const parts = keys.toLowerCase().split("+");
  return {
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    key: parts.filter((p) => p !== "mod" && p !== "shift" && p !== "alt")[0] ?? "",
  };
}

function matchesEvent(parsed: ParsedKeys, e: KeyboardEvent): boolean {
  const modPressed = isMac ? e.metaKey : e.ctrlKey;
  if (parsed.mod !== modPressed) return false;
  if (parsed.shift !== e.shiftKey) return false;
  if (parsed.alt !== e.altKey) return false;

  const eventKey = e.key.toLowerCase();

  // Handle special key names
  if (parsed.key === "delete") return eventKey === "delete";
  if (parsed.key === "f2") return eventKey === "f2";
  if (parsed.key === "=") return eventKey === "=" || eventKey === "+";
  if (parsed.key === "-") return eventKey === "-";
  if (parsed.key === ",") return eventKey === ",";

  return eventKey === parsed.key;
}

export function useShortcut(actions: Record<string, () => void>) {
  const actionsRef = useRef(actions);
  const location = useLocation();
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    actionsRef.current = actions;
    locationRef.current = location.pathname;
  });

  useEffect(() => {
    const parsedShortcuts = SHORTCUTS.map((s) => ({
      ...s,
      parsed: parseKeys(s.keys),
    }));

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      const onEditor = locationRef.current === "/editor";

      for (const shortcut of parsedShortcuts) {
        if (shortcut.editorOnly && !onEditor) continue;
        if (!matchesEvent(shortcut.parsed, e)) continue;

        // Allow typing in inputs for most shortcuts, but still allow
        // shortcuts that use mod key when in editable fields
        if (isEditable && !shortcut.parsed.mod) continue;

        const handler = actionsRef.current[shortcut.id];
        if (handler) {
          e.preventDefault();
          handler();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);
}
