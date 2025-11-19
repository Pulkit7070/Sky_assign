# Sky Desktop Assistant

A premium, floating AI assistant for your desktop with macOS-inspired glassmorphism design. Built with **Electron 28+**, **React 18+**, **TypeScript 5+**, **Tailwind CSS v4**, **Zustand 4+**, and **Framer Motion 11+**.

## ✨ Features

- 🎨 **Premium Glassmorphism** - macOS-style vibrancy with backdrop blur and translucent layers
- 🪟 **Dual Window Modes** - Compact floating assistant (420×160px) & expanded full window (900×700px)
- 💬 **Persistent Conversations** - Auto-save chat history with localStorage
- 🎯 **Quick Actions** - Summarize, translate, explain code, and more
- ⌨️ **Global Shortcuts** - `Ctrl + \`` to toggle visibility (customizable)
- 🎭 **Smooth 60fps Animations** - Physics-based transitions with Framer Motion
- 📝 **Markdown Support** - Rich text rendering with Prism.js code highlighting
- 🔍 **Search Conversations** - Instant search with fuzzy matching
- 🚦 **macOS Traffic Lights** - Red/yellow/green buttons with hover icons
- 🎪 **Always on Top** - Frameless window floating above all apps

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Windows 10+** (dev environment) or **macOS 10.15+** (target)

### Installation

1. **Clone or navigate to the project directory:**

```bash
cd sky_assign
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run in development mode:**

```bash
npm run electron:dev
```

The app will launch with hot-reload enabled. Edit files in `src/` and see changes instantly.

## 🛠️ Build

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

This will:

- Compile TypeScript
- Bundle React app with Vite
- Package Electron app for your platform

Build artifacts will be in the `release/` directory.

## ⌨️ Keyboard Shortcuts

| Shortcut           | Action                     |
| ------------------ | -------------------------- |
| `Cmd/Ctrl + Space` | Toggle window visibility   |
| `Cmd/Ctrl + Enter` | Send message (in input)    |
| `Enter`            | New line (in input)        |
| `Esc`              | Hide window (when focused) |

## 🏗️ Architecture

```
sky-desktop-assistant/
├── electron/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Context bridge (IPC)
├── src/
│   ├── components/
│   │   ├── FloatingWindow.tsx    # Compact mode UI
│   │   ├── ExpandedWindow.tsx    # Full mode UI
│   │   ├── ChatMessage.tsx       # Message renderer
│   │   ├── ConversationList.tsx  # Sidebar conversations
│   │   ├── ActionTabs.tsx        # Quick action buttons
│   │   ├── MessageInput.tsx      # Input box
│   │   ├── ErrorBoundary.tsx     # Error handling
│   │   └── UIStates.tsx          # Loading/empty/error states
│   ├── store/
│   │   └── useAppStore.ts        # Zustand global state
│   ├── types/
│   │   ├── index.ts              # Type definitions
│   │   └── electron.d.ts         # Electron API types
│   ├── utils/
│   │   └── platform.ts           # Platform helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Change Window Size

Edit `electron/main.ts`:

```typescript
const COMPACT_SIZE = { width: 420, height: 120 };
const EXPANDED_SIZE = { width: 900, height: 700 };
```

### Change Hotkey

Edit `electron/main.ts`:

```typescript
const shortcut = isMac ? "Command+Space" : "Control+Space";
```

### Add Custom Actions

Edit `src/store/useAppStore.ts`:

```typescript
const initialActions: Action[] = [
  { id: "1", label: "Your Action", state: "ready" },
  // ...
];
```

### Customize Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'sky-accent': '#3b82f6',  // Change primary color
  // ...
}
```

## 🧩 State Management

The app uses **Zustand** with persistence middleware:

- **Conversations** - Saved to `localStorage`
- **Window Mode** - Remembers compact/expanded state
- **User Preferences** - Theme, hotkeys, window size
- **Actions** - Quick action states

## 🔧 Troubleshooting

### Hotkey Not Working

The default `Cmd/Ctrl + Space` may conflict with Spotlight (macOS) or other apps. The app automatically tries ` Cmd/Ctrl + \`` as fallback. You can modify shortcuts in  `electron/main.ts`.

### Window Not Appearing

Check if the window is positioned off-screen:

- Close the app
- Delete the window state file (location varies by OS)
- Restart the app

### Build Errors on Windows

Ensure you have:

- Latest Node.js LTS
- Visual Studio Build Tools (for native modules)
- Run `npm install` with administrator privileges if needed

### macOS Vibrancy Not Working

Vibrancy only works on macOS. On Windows/Linux, the app uses CSS `backdrop-filter` as fallback.

## 🧪 Technologies Used

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Electron**       | Desktop app framework           |
| **React 18**       | UI library                      |
| **TypeScript**     | Type safety                     |
| **Vite**           | Fast build tool                 |
| **Tailwind CSS**   | Utility-first styling           |
| **Zustand**        | State management                |
| **Framer Motion**  | Animations                      |
| **react-markdown** | Markdown rendering              |
| **Prism.js**       | Code highlighting               |
| **react-window**   | Virtualization (for long lists) |

## 📦 Platform-Specific Features

### macOS

- ✅ Native vibrancy effects
- ✅ Wallpaper-aware tinting
- ✅ Cmd key shortcuts
- ✅ Traffic light button spacing

### Windows

- ✅ CSS backdrop blur fallback
- ✅ Ctrl key shortcuts
- ✅ Windows 11 styled corners

### Linux

- ✅ Same as Windows
- ⚠️ Blur may not work on all DEs

## 🐛 Known Issues

- [ ] First launch may show shortcut conflict warning
- [ ] Markdown table rendering needs wider view
- [ ] Long code blocks require horizontal scroll

## 🤝 Contributing

This is a grading project, but feel free to fork and extend!

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Electron Documentation
- React Docs
- Zustand Documentation
- Framer Motion Docs
- Tailwind CSS
- Sky.app Frontend Research Guide (inspiration)

## 📧 Contact

For questions or feedback, open an issue in the repository.

---

**Built with ❤️ for the Sky Desktop Assistant project**
