# 🚀 Quick Reference Guide

## 📦 Installation (One-Time Setup)

```bash
cd c:\Users\Asus\Desktop\project\sky_assign
npm install
```

## 🏃 Running the App

### Development Mode (with hot-reload)

```bash
npm run electron:dev
```

### Production Build

```bash
npm run build
```

### Package as Executable

```bash
npm run electron:build
```

## ⌨️ Keyboard Shortcuts

| Action        | Windows            | macOS           |
| ------------- | ------------------ | --------------- |
| Show/Hide App | `Ctrl + Space`     | `Cmd + Space`   |
| Send Message  | `Ctrl + Enter`     | `Cmd + Enter`   |
| New Line      | `Enter`            | `Enter`         |
| Open DevTools | `Ctrl + Shift + I` | `Cmd + Opt + I` |

## 🎯 Quick Actions

### Basic Usage

1. **Launch app**: `npm run electron:dev`
2. **Type message** in input box
3. **Press Ctrl+Enter** to send
4. **Click green button** to expand window
5. **Click yellow button** to collapse

### Managing Conversations

- **New conversation**: Click `+` button in sidebar
- **Search**: Type in search box
- **Delete**: Swipe left on conversation item
- **Switch**: Click on conversation in list

### Using Actions

- Click any action button (Summarize, Translate, etc.)
- Watch loading animation
- See completion checkmark

## 🔧 Common Tasks

### Clear All Data

```javascript
// In DevTools Console:
localStorage.clear();
// Then refresh: Ctrl+R
```

### Change Window Size

Edit `electron/main.ts`:

```typescript
const COMPACT_SIZE = { width: 420, height: 120 };
const EXPANDED_SIZE = { width: 900, height: 700 };
```

### Change Theme Color

Edit `tailwind.config.js`:

```javascript
'sky-accent': '#3b82f6',  // Your color here
```

### Change Hotkey

Edit `electron/main.ts`:

```typescript
const shortcut = "Alt+A"; // Your shortcut
```

## 🐛 Troubleshooting

### App Won't Start

```bash
# Kill port 5173 if in use
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Restart
npm run electron:dev
```

### "Module not found" Error

```bash
rm -rf node_modules package-lock.json
npm install
```

### Window Not Appearing

- Close app: `Ctrl+C` in terminal
- Delete window state
- Restart: `npm run electron:dev`

### Hotkey Not Working

- Default is `Ctrl+Space` (Windows)
- Fallback is `Ctrl+`` if conflict
- Check console for warnings

## 📁 Important Files

| File                       | Purpose                |
| -------------------------- | ---------------------- |
| `electron/main.ts`         | Main Electron process  |
| `electron/preload.ts`      | IPC bridge             |
| `src/App.tsx`              | Root React component   |
| `src/store/useAppStore.ts` | Global state           |
| `src/components/`          | UI components          |
| `tailwind.config.js`       | Styling config         |
| `package.json`             | Dependencies & scripts |

## 🎨 Customization Points

### Colors

- `tailwind.config.js` → `colors` section

### Window Behavior

- `electron/main.ts` → Window options

### Default Actions

- `src/store/useAppStore.ts` → `initialActions`

### Styles

- `src/index.css` → Global styles

## 📊 Project Structure

```
sky_assign/
├── electron/               # Electron main process
│   ├── main.ts            # Window management
│   └── preload.ts         # IPC bridge
│
├── src/
│   ├── components/        # React UI components
│   ├── store/            # Zustand state
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # React entry
│   └── index.css         # Global styles
│
├── package.json          # Dependencies
├── vite.config.ts        # Build config
├── tailwind.config.js    # Styling config
└── tsconfig.json         # TypeScript config
```

## 🔍 Debugging

### Check Main Process Logs

Look at terminal where you ran `npm run electron:dev`

### Check Renderer Logs

Open DevTools: `Ctrl + Shift + I`

### View Current State

```javascript
// In DevTools Console:
JSON.parse(localStorage.getItem("sky-assistant-storage"));
```

### Monitor IPC Calls

```typescript
// In electron/main.ts:
ipcMain.handle("method-name", (event, arg) => {
  console.log("IPC called:", arg);
  return result;
});
```

## 💾 Data Storage

### Location

- **Storage**: localStorage
- **Key**: `sky-assistant-storage`

### What's Stored

- All conversations
- Current conversation ID
- User preferences
- Window mode

### Reset Storage

```javascript
localStorage.removeItem("sky-assistant-storage");
```

## 🚀 Performance Tips

### Development

- ✅ Hot-reload enabled
- ✅ DevTools open by default
- ✅ Source maps available

### Production

- ✅ Minified bundles
- ✅ Tree-shaking
- ✅ Optimized assets

## 📚 Documentation Files

| File                 | Content            |
| -------------------- | ------------------ |
| `README.md`          | Project overview   |
| `SETUP.md`           | Installation guide |
| `ARCHITECTURE.md`    | Technical details  |
| `CHECKLIST.md`       | Feature checklist  |
| `QUICK_REFERENCE.md` | This file          |

## 🎓 Learning Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

## ⚡ Hot Tips

1. **Use DevTools** - Press `Ctrl+Shift+I` to inspect
2. **Check Console** - All errors appear there
3. **Save Often** - Files auto-reload on save
4. **Test Both Modes** - Compact AND expanded
5. **Try All Actions** - Each button has states
6. **Search Works** - Type in conversation search
7. **Swipe to Delete** - Drag conversation left
8. **Hotkey Toggle** - `Ctrl+Space` to hide/show
9. **Persist Data** - Conversations save automatically
10. **Read Logs** - Terminal shows main process logs

## 🎉 You're All Set!

The app is fully built and ready to run. Start with:

```bash
npm run electron:dev
```

---

**Need help?** Check the other documentation files or the troubleshooting section above.
