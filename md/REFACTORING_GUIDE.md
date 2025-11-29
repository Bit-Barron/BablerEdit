# Babel Edit Clone - Refactoring Guide

## 🔴 CRITICAL FIXES

### 1. Fix Type Imports Throughout the App

**Problem**: `FrameworkType`, `Language`, and `TreeNode` types are not exported

**Files to Update**:

#### `src/core/lib/frameworks.ts`

```typescript
import { FrameworkConfig, FrameworkType } from "../types/framework";

// Rest of file stays the same
```

#### `src/features/files/store/file-store.ts`

```typescript
import { FrameworkType } from "@/core/types/framework";
import { Language } from "../types/files";
// ... rest of imports
```

#### `src/features/files/types/files.ts`

```typescript
export interface Language {
  id: string;
  name: string;
  code: string;
  file: File;
}
```

#### `src/features/editor/types/editor.ts`

```typescript
export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}
```

---

## 📦 REMOVE UNUSED DEPENDENCIES

```bash
bun remove @radix-ui/react-checkbox @radix-ui/react-label tw-animate-css
```

**Why**: These are imported but the actual UI components don't exist in your codebase.

---

## ➕ ADD MISSING UI COMPONENTS

You're importing these but they don't exist:

```bash
# Add missing shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add checkbox
npx shadcn@latest add label
```

Or create them manually in `src/core/components/ui/`

---

## 🗑️ REMOVE UNUSED FILES

### Delete Example Files (if not needed)

```bash
rm -rf public/examples/
```

**Why**: The `de.json`, `fr.json`, `it.json` files in `public/examples/` are example translation files. Keep them only if you want example data for testing.

---

## 🔧 CODE IMPROVEMENTS

### 1. Fix `buildTranslationTree` Logic Issue

**File**: `src/features/editor/lib/build-tree.ts`

**Problem**: The recursion depth parameter isn't being used correctly

```typescript
export const buildTranslationTree = (obj: any): TreeNode[] => {
  const translations = obj?.translations || {};
  const allKeys = Object.keys(translations).sort();

  const buildNode = (keys: string[], depth: number = 0): TreeNode[] => {
    const grouped = new Map<string, string[]>();

    keys.forEach((key) => {
      const parts = key.split(".");
      const currentPart = parts[depth];

      if (!currentPart) return;

      if (!grouped.has(currentPart)) {
        grouped.set(currentPart, []);
      }
      grouped.get(currentPart)!.push(key);
    });

    return Array.from(grouped.entries()).map(([part, partKeys]) => {
      const hasDeeper = partKeys.some((k) => k.split(".").length > depth + 1);

      if (!hasDeeper) {
        // This is a leaf node
        return {
          id: partKeys[0],
          name: part,
        };
      }

      // This is a folder node
      return {
        id: partKeys[0]
          .split(".")
          .slice(0, depth + 1)
          .join("."),
        name: part,
        children: buildNode(partKeys, depth + 1),
      };
    });
  };

  return buildNode(allKeys);
};
```

---

### 2. Remove Console.logs in Production Code

**Files to clean**:

- `src/features/editor/components/editor-tree-node.tsx` (line 1953)
- `src/features/editor/lib/build-tree.ts` (lines 1999, 2007)
- `src/features/editor/components/editor-detail-panel.tsx` (line 1883)
- `src/features/parser/lib/json-parser.ts` (line 2564)
- `src/features/parser/index.ts` (line 2510)

Either remove them or wrap in development check:

```typescript
if (import.meta.env.DEV) {
  console.log("Debug info");
}
```

---

### 3. Add Missing File Upload Component

You're using `FileUpload` components but they don't exist. You need to either:

**Option A**: Install a file upload library

```bash
bun add react-dropzone
```

**Option B**: Create your own based on the usage in `files-language-upload-dropzone.tsx`

---

### 4. Fix Tauri Window Configuration

**File**: `src-tauri/tauri.conf.json`

```json
{
  "app": {
    "windows": [
      {
        "title": "Babel Edit",
        "width": 1200, // ← Increase from 300
        "height": 800, // ← Increase from 200
        "decorations": true, // ← Enable window decorations
        "resizable": true,
        "fullscreen": false,
        "center": true
      }
    ]
  }
}
```

**Current issue**: Your window is only 300x200px with no decorations!

---

## 📁 SUGGESTED FILE STRUCTURE

```
src/
├── app/
│   ├── App.tsx
│   └── App.css
├── core/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── menubar.tsx
│   │   │   └── toolbar.tsx
│   │   ├── providers/
│   │   │   └── theme-provider.tsx
│   │   └── ui/           # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── frameworks.ts
│   │   └── utils.ts
│   └── types/
│       └── framework.ts
├── features/
│   ├── editor/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   ├── files/
│   │   ├── components/
│   │   ├── store/
│   │   └── types/
│   ├── parser/
│   │   ├── lib/
│   │   └── types/
│   └── wizzard/
│       ├── components/
│       ├── store/
│       └── types/
└── pages/
    ├── editor.tsx
    └── wizzard.tsx
```

---

## 🚀 PERFORMANCE IMPROVEMENTS

### 1. Memoize Expensive Computations

**File**: `src/pages/editor.tsx`

```typescript
import { useMemo } from "react";

export const EditorPage: React.FC<EditorPageProps> = ({}) => {
  // ... existing code ...

  const treeData = useMemo(() => {
    if (!primaryLanguageData) return [];
    return buildTranslationTree(primaryLanguageData);
  }, [primaryLanguageData]);

  // ... rest of component
};
```

### 2. Add Loading States

Currently no loading indicators when parsing files or navigating.

---

## 🧪 TESTING RECOMMENDATIONS

1. **Add Vitest** for unit tests

```bash
bun add -D vitest @testing-library/react @testing-library/jest-dom
```

2. Test critical functions:
   - `flattenJson`
   - `extractLanguageCode`
   - `buildTranslationTree`
   - File validation in `frameworks.ts`

---

## 🔒 SECURITY IMPROVEMENTS

### 1. Validate File Contents

**File**: `src/features/parser/lib/json-parser.ts`

Add size limits and validation:

```typescript
export async function parseJSONFile(file: File): Promise<any> {
  // Add max file size check
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${file.name} (max 10MB)`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        // Validate JSON structure
        if (typeof json !== "object" || json === null) {
          throw new Error("Invalid JSON structure");
        }
        resolve(json);
      } catch (error) {
        reject(new Error(`Invalid JSON file: ${error}`));
      }
    };
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    reader.readAsText(file);
  });
}
```

---

## 📝 QUICK FIX CHECKLIST

- [ ] Export all types properly (FrameworkType, Language, TreeNode)
- [ ] Remove unused dependencies
- [ ] Add missing shadcn/ui components
- [ ] Fix Tauri window size (300x200 → 1200x800)
- [ ] Remove/wrap console.logs
- [ ] Add FileUpload component or library
- [ ] Memoize expensive computations
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Fix buildTranslationTree logic

---

## 🎯 NEXT STEPS (Priority Order)

1. **HIGH**: Fix all type exports (breaks app)
2. **HIGH**: Fix Tauri window configuration (unusable window)
3. **HIGH**: Add missing UI components (buttons don't work)
4. **MEDIUM**: Remove console.logs
5. **MEDIUM**: Add memoization for performance
6. **LOW**: Remove unused dependencies
7. **LOW**: Delete example files if not needed

---

## 💡 OPTIONAL ENHANCEMENTS

1. **Add Keyboard Shortcuts** using a library like `react-hotkeys-hook`
2. **Add Undo/Redo** functionality for translations
3. **Add Search/Filter** in the tree view
4. **Add Export** functionality (save edited translations)
5. **Add Validation** (missing translations, duplicates, etc.)
6. **Add Machine Translation** integration (Google Translate API, DeepL, etc.)

---

Would you like me to help implement any of these fixes?
