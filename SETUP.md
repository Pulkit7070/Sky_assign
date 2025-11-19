# 🚀 Installation & Setup Guide

## Step-by-Step Installation

### 1. Navigate to Project Directory

```bash
cd c:\Users\Asus\Desktop\project\sky_assign
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- Electron 28.x
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x
- Zustand 4.x
- Framer Motion 11.x
- And all other dependencies

**Note:** Installation takes 5-10 minutes on first run.

### 3. Run Development Server

```bash
npm run electron:dev
```

This will:

1. Start Vite dev server on `http://localhost:5173`
2. Launch Electron app with hot-reload
3. Open DevTools automatically (in dev mode)

The app window will appear as a small floating assistant in the bottom-right of your screen.

## 🎯 First Launch

### What You'll See:

1. **Compact Window** - A small translucent window (~420x120px)
2. **Input Box** - "Ask me anything..." placeholder
3. **Green Button** - Click to expand to full mode

### Try These Actions:

1. ✅ Type a message and press `Cmd/Ctrl + Enter` to send
2. ✅ Click the green button to expand
3. ✅ Press `Cmd/Ctrl + Space` to hide/show the window
4. ✅ Drag the window by clicking the header area

## ⌨️ Keyboard Shortcuts

| Shortcut       | Action                     |
| -------------- | -------------------------- |
| `Ctrl + Space` | Show/hide window (Windows) |
| `Cmd + Space`  | Show/hide window (macOS)   |
| `Ctrl + Enter` | Send message               |
| `Enter`        | New line in input          |

**Note:** On macOS, `Cmd + Space` might conflict with Spotlight. The app will automatically try `Cmd + \`` as fallback.

## 🐛 Troubleshooting

### Issue: "Port 5173 already in use"

**Solution:**

```bash
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run electron:dev
```

### Issue: Electron window not appearing

**Solution:**

- Check if the window is positioned off-screen
- Close and restart: `Ctrl + C` then `npm run electron:dev`

### Issue: "Cannot find module"

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Shortcut not working

**Solution:**
The app will show a notification if the shortcut conflicts with another app. You can:

- Close conflicting apps
- Or modify the shortcut in `electron/main.ts`

### Issue: Blur effect not working

**Solution:**

- On Windows: This is expected. The app uses CSS blur fallback
- On macOS: Ensure you're running the app natively (not in VM)

## 📦 Build for Production

### Build the app:

```bash
npm run build
```

This creates production-ready bundles in `dist/` and `dist-electron/`.

### Package as executable:

```bash
npm run electron:build
```

This will:

- Build the app for your current platform
- Create installer/portable version in `release/` folder

**Output:**

- Windows: `.exe` installer + portable `.exe`
- macOS: `.dmg` + `.zip`
- Linux: `.AppImage` + `.deb`

## 🔧 Configuration

### Change Window Size

Edit `electron/main.ts`:

```typescript
const COMPACT_SIZE = { width: 500, height: 150 }; // Your size
const EXPANDED_SIZE = { width: 1000, height: 800 }; // Your size
```

### Change Hotkey

Edit `electron/main.ts`:

```typescript
const shortcut = "Alt+A"; // Your preferred shortcut
```

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'sky-accent': '#your-color',
}
```

## 🎨 Development Tips

### Hot Reload

Changes to `.tsx`, `.ts`, `.css` files trigger automatic reload.

### DevTools

Press `Ctrl + Shift + I` (Windows) or `Cmd + Opt + I` (macOS) to toggle DevTools.

### Debugging

- **Main Process:** Logs appear in terminal
- **Renderer Process:** Logs appear in DevTools console

### State Persistence

The app saves data to `localStorage`. To reset:

1. Open DevTools
2. Go to Application → Local Storage
3. Delete `sky-assistant-storage` key

## 📁 Project Structure

```
sky_assign/
├── electron/           # Electron main & preload
├── src/
│   ├── components/     # React components
│   ├── store/          # Zustand state
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
├── dist/               # Vite build output
├── dist-electron/      # Electron build output
└── release/            # Packaged app
```

## ✅ Verification Checklist

After installation, verify:

- [ ] App launches without errors
- [ ] Input box is functional
- [ ] Messages appear when sent
- [ ] Expand/collapse button works
- [ ] Global hotkey toggles visibility
- [ ] Conversations persist after restart
- [ ] Action buttons show loading states
- [ ] Swipe-to-delete works on conversations

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Review the troubleshooting section above
3. Delete `node_modules` and reinstall
4. Check GitHub Issues (if public repo)

## 🎉 You're Ready!

Your Sky Desktop Assistant is now set up and running. Enjoy! 🚀
