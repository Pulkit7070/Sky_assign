# 🚀 START HERE - Quick Launch Guide

## ✨ Your Sky Desktop Assistant is Ready!

Everything is built and configured. Follow these simple steps:

---

## 📦 Step 1: Verify Installation (Already Done!)

✅ All dependencies are installed (621 packages)
✅ All files are created (30+ files)
✅ Configuration is complete

---

## 🎯 Step 2: Launch the App

### Open your terminal and run:

```powershell
npm run electron:dev
```

### What will happen:

1. ⚡ Vite dev server starts on port 5173
2. 🖥️ Electron window appears in bottom-right corner
3. 🔧 DevTools open automatically (for debugging)
4. 🎨 Translucent floating window is ready!

### Expected result:

A small floating window (~420×160px) with:

- Translucent blurred background
- Input box with placeholder "Ask me anything..."
- Green button to expand
- Draggable header area

---

## 🎮 Step 3: Try These Features

### Basic Chat

1. ✅ Type "Hello Sky!" in the input box
2. ✅ Press `Ctrl + Enter` to send
3. ✅ Watch your message appear
4. ✅ See AI response after ~1 second

### Window Modes

5. ✅ Click the **green button** to expand window
6. ✅ See full interface with sidebar
7. ✅ Click the **yellow button** to collapse
8. ✅ Press `Ctrl + Space` to hide/show window

### Conversations

9. ✅ Send a message (creates new conversation)
10. ✅ Click **+** button to create another conversation
11. ✅ **Swipe left** on a conversation to delete
12. ✅ Use **search box** to filter conversations

### Actions

13. ✅ Click "Summarize" action button
14. ✅ Watch loading animation
15. ✅ See completion checkmark

---

## ⌨️ Keyboard Shortcuts

| Shortcut           | Action              |
| ------------------ | ------------------- |
| `Ctrl + \``        | Show/Hide window    |
| `Ctrl + Enter`     | Send message        |
| `Enter`            | New line in message |
| `Ctrl + Shift + I` | Open DevTools       |

> **Note:** The global shortcut is `Ctrl + \`` (backtick key) to avoid conflicts with system shortcuts.

---

## 🎨 What You'll See

### Compact Mode (Default)

```
┌─────────────────────────────────────┐
│ 🟢  Sky Assistant                   │
├─────────────────────────────────────┤
│                                     │
│  Type your message here...          │
│                                 [→] │
└─────────────────────────────────────┘
```

### Expanded Mode (After clicking green button)

```
┌─────────────────────────────────────────────────────────┐
│ 🟡  Sky Assistant                          [-] [×]       │
├───────────────┬─────────────────────────────────────────┤
│ Conversations │ Chat Area                               │
│               │                                         │
│ [+] Search... │ Messages appear here...                 │
│               │                                         │
│ • Chat 1      │                                         │
│ • Chat 2      │                                         │
│               │                                         │
│               ├─────────────────────────────────────────┤
│               │ [Summarize] [Translate] [Explain]...    │
│               ├─────────────────────────────────────────┤
│               │ Type your message...                [→] │
└───────────────┴─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### "Port 5173 already in use"

```powershell
# Find and kill the process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run electron:dev
```

### App window not appearing

- Check if it's hidden behind other windows
- Try pressing `Ctrl + Space` to toggle visibility
- Close and restart: Press `Ctrl + C`, then run again

### "Cannot find module" error

```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

---

## 📖 Need More Help?

Check these documentation files:

- **README.md** - Full project overview
- **SETUP.md** - Detailed setup guide
- **QUICK_REFERENCE.md** - Common operations
- **ARCHITECTURE.md** - Technical deep dive
- **CHECKLIST.md** - Feature verification

---

## 🎉 You're Ready!

Just run this one command:

```powershell
npm run electron:dev
```

The app will launch and you can start chatting! 🚀

---

## 💡 Pro Tips

1. **DevTools are your friend** - They open automatically for debugging
2. **Drag the window** - Click and drag the header area
3. **Conversations persist** - Your chats are saved automatically
4. **Try all actions** - Each has loading and completion states
5. **Search works** - Filter conversations by typing in search
6. **Markdown supported** - Try sending code blocks
7. **Hotkey is global** - Works even when window is hidden
8. **Swipe to delete** - Or hover and click delete button

---

**Built with ❤️ for your Sky Desktop Assistant project**

🚀 **Let's launch!** Run: `npm run electron:dev`
