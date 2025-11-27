import { useState } from "react";

export default function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      label: "File",
      items: [
        { label: "New Project...", shortcut: "⌘N" },
        { label: "Open Project...", shortcut: "⌘O" },
        { label: "Open Recent", hasSubmenu: true },
        { divider: true },
        { label: "Close Project", shortcut: "⌘W" },
        { label: "Save Project", shortcut: "⌘S" },
        { label: "Save Project As...", shortcut: "⇧⌘S" },
        { divider: true },
        { label: "Import..." },
        { label: "Export..." },
        { divider: true },
        { label: "Quit", shortcut: "⌘Q" },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z" },
        { label: "Redo", shortcut: "⇧⌘Z" },
        { divider: true },
        { label: "Cut", shortcut: "⌘X" },
        { label: "Copy", shortcut: "⌘C" },
        { label: "Paste", shortcut: "⌘V" },
        { divider: true },
        { label: "Find...", shortcut: "⌘F" },
        { label: "Replace...", shortcut: "⌘R" },
      ],
    },
    {
      label: "Find",
      items: [
        { label: "Find Translation...", shortcut: "⌘F" },
        { label: "Find Next", shortcut: "⌘G" },
        { label: "Find Previous", shortcut: "⇧⌘G" },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Show Toolbar", checked: true },
        { label: "Show Status Bar", checked: true },
        { divider: true },
        { label: "Zoom In", shortcut: "⌘+" },
        { label: "Zoom Out", shortcut: "⌘-" },
        { label: "Actual Size", shortcut: "⌘0" },
      ],
    },
    {
      label: "Tools",
      items: [
        { label: "Pre-Translate..." },
        { label: "Machine Translation..." },
        { label: "Consistency Check..." },
        { divider: true },
        { label: "Validate Translations" },
        { label: "Statistics..." },
      ],
    },
    {
      label: "Window",
      items: [
        { label: "Minimize", shortcut: "⌘M" },
        { label: "Zoom" },
        { divider: true },
        { label: "Bring All to Front" },
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Babel Edit Help" },
        { label: "Check for Updates..." },
        { divider: true },
        { label: "About Babel Edit" },
      ],
    },
  ];

  return (
    <div className={`bg-background border-b `}>
      <div className="flex items-center h-6 px-2 text-[13px]">
        {menus.map((menu) => (
          <div
            key={menu.label}
            className="relative"
            onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
          >
            <button
              className="px-2 py-0.5 hover:bg-accent rounded-sm transition-colors"
              onClick={() =>
                setActiveMenu(activeMenu === menu.label ? null : menu.label)
              }
            >
              {menu.label}
            </button>

            {activeMenu === menu.label && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />

                <div className="absolute left-0 top-full mt-0.5 z-50 min-w-[220px] bg-popover border rounded-md shadow-lg py-1">
                  {menu.items.map((item, index) => {
                    if ("divider" in item && item.divider) {
                      return (
                        <div
                          key={`divider-${index}`}
                          className="my-1 h-px bg-border"
                        />
                      );
                    }

                    return (
                      <button
                        key={item.label}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          console.log("Menu item clicked:", item.label);
                          setActiveMenu(null);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {"checked" in item && item.checked && (
                            <span className="text-xs">✓</span>
                          )}
                          {item.label}
                          {"hasSubmenu" in item && item.hasSubmenu && (
                            <span className="ml-auto text-xs">▶</span>
                          )}
                        </span>
                        {"shortcut" in item && item.shortcut && (
                          <span className="text-muted-foreground text-xs ml-8">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
