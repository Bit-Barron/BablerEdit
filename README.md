# BablerEdit

A modern, open-source desktop translation editor for managing multi-language localization files. Built with Tauri, React, and TypeScript.

BablerEdit helps developers and translators manage translation files across 11+ frameworks with a tree-based UI, AI-powered translations, consistency checking, and CSV import/export.

## Features

**Core Editor**
- Tree-based hierarchical view of translation keys
- Inline editing of translations per language
- Add, rename, duplicate, and delete translation IDs
- Cut, copy, and paste operations
- Drag-and-drop reordering
- Command palette for quick search (Ctrl+F)
- Multi-select support with Ctrl+Click
- Right-click context menu

**AI-Powered Translation**
- Pre-translate missing values using LLM providers:
  - NVIDIA NIM (Llama 3.3 70B)
  - Fireworks (Llama 3.3 70B)
  - Mistral (Mistral Small)
- Traditional translation APIs:
  - Google Translate
  - DeepL
  - Microsoft Translator
- Consistency checker to find missing translations
- Translation statistics and completeness tracking

**Supported Frameworks**
| Framework | File Format |
|-----------|------------|
| Generic JSON | `.json` |
| Generic YAML | `.yaml`, `.yml` |
| i18next | `.json` |
| React i18n | `.json` |
| Vue i18n | `.json` |
| Flutter | `.arb` |
| Laravel | `.json`, `.php` |
| Ruby on Rails | `.yaml` |
| XLIFF | `.xlf`, `.xliff` |
| Java Properties | `.properties` |
| .NET RESX | `.resx` |

**File Operations**
- Project-based workflow (`.babler` project files)
- Import translation files from any supported format
- Export to CSV / Import from CSV
- Recent projects for quick access
- Auto-save with unsaved changes indicator

**Customization**
- Dark and light theme
- 5+ color schemes (Zinc, Slate, Rose, Blue, Green, Orange, Violet)
- Font selection (Inter, Space Grotesk, JetBrains Mono, etc.)
- Adjustable border radius
- Zoom in/out (Ctrl+Plus/Minus)
- Toggle toolbar visibility

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New Project |
| `Ctrl+O` | Open Project |
| `Ctrl+S` | Save Project |
| `Ctrl+W` | Close Project |
| `Ctrl+F` | Find Translation |
| `Ctrl+Shift+A` | Add ID |
| `Delete` | Delete Selected |
| `F2` | Rename |
| `Ctrl+X` | Cut |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+D` | Duplicate |
| `Ctrl+=` | Zoom In |
| `Ctrl+-` | Zoom Out |
| `Ctrl+0` | Reset Zoom |
| `Ctrl+Shift+P` | Pre-Translate |
| `Ctrl+,` | Settings |

## Installation

### Download

Download the latest release for your platform from the [Releases](https://github.com/Bit-Barron/BablerEdit/releases) page:

- **Windows**: `.exe` installer or `.msi`
- **macOS**: `.dmg`
- **Linux**: `.deb`, `.AppImage`, or install via AUR

### Arch Linux (AUR)

```bash
yay -S bableredit-bin
```

## Build from Source

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri backend)
- System dependencies for Tauri: see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

### Steps

```bash
# Clone the repository
git clone https://github.com/Bit-Barron/BablerEdit.git
cd BablerEdit

# Install dependencies
bun install

# Run in development mode
bun run tauri dev

# Build for production
bun run tauri build
```

Built binaries will be in `src-tauri/target/release/bundle/`.

## Configuration

### API Keys

All translation API keys are configured in-app via **Tools > API Keys**. No environment variables are needed.

To use AI-powered translation, get free API keys from:
- [NVIDIA NIM](https://build.nvidia.com/) - Free tier available
- [Fireworks](https://fireworks.ai/) - Free tier available
- [Mistral](https://console.mistral.ai/) - Free tier available
- [Google Cloud Translation](https://cloud.google.com/translate) - 500K chars/month free
- [DeepL](https://www.deepl.com/pro-api) - 500K chars/month free
- [Microsoft Translator](https://azure.microsoft.com/en-us/products/ai-services/ai-translator) - 2M chars/month free

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Zustand
- **Desktop**: Tauri 2
- **UI**: Radix UI, React Arborist, Framer Motion, CMDK
- **Build**: Vite 7, Bun

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
