# 🖼️ Visual Guide - Sky Desktop Assistant

## What You'll See When You Launch

---

## 1️⃣ Initial Launch

### Compact Floating Window

```
┌─────────────────────────────────────────────────┐
│  🟢                 Sky Assistant                │  ← Draggable header
├─────────────────────────────────────────────────┤
│                                                  │
│  👋 Hi! How can I help you today?               │  ← Welcome message
│                                                  │
├─────────────────────────────────────────────────┤
│  Ask me anything...                         [→] │  ← Input box
└─────────────────────────────────────────────────┘
     ↑
  Green button: Click to expand
```

**Size:** ~420 × 120 pixels  
**Position:** Bottom-right corner  
**Background:** Translucent with blur effect  
**Always on top:** Yes

---

## 2️⃣ After Sending a Message

### Chat Interface

```
┌─────────────────────────────────────────────────┐
│  🟢                 Sky Assistant                │
├─────────────────────────────────────────────────┤
│                                                  │
│                     Hello Sky! ────────────────┐ │  ← Your message
│                                                 │ │    (blue bubble)
│                                                 └─┤
│                                                  │
│  ┌── I received your message: "Hello Sky!"      │  ← AI response
│  │                                               │    (white bubble)
│  │   This is a mock response...                 │
│  └───                                            │
│                                                  │
├─────────────────────────────────────────────────┤
│  Type your next message...                  [→] │
└─────────────────────────────────────────────────┘
```

---

## 3️⃣ Expanded Mode (Full Interface)

### Full Window with Sidebar

````
┌──────────────────────────────────────────────────────────────────┐
│  🟡  Sky Assistant                                   [-]  [×]     │  ← Header with controls
├────────────────────┬─────────────────────────────────────────────┤
│  Conversations     │  Chat Area                                  │
│                    │                                             │
│  [+]  [Search... ] │  👋 Welcome to Sky Assistant                │
│                    │                                             │
│  🔍 New Conversa...│  I'm here to help you with anything...     │
│  🔍 Chat about...  │                                             │
│  🔍 How to...      │                     Your message ─────────┐ │
│                    │                                            │ │
│                    │  ┌── AI response                           │ │
│  (swipe left       │  │   Here's my answer...                  └─┤
│   to delete)       │  │   With **markdown** support             │
│                    │  │                                          │
│                    │  │   ```javascript                          │
│                    │  │   const code = "highlighted";           │
│                    │  │   ```                         [Copy]     │
│                    │  └─────                                     │
│                    │                                             │
├────────────────────┼─────────────────────────────────────────────┤
│                    │  [Summarize] [Translate] [Explain Code]... │  ← Action tabs
├────────────────────┼─────────────────────────────────────────────┤
│                    │  Type your message...                   [→] │  ← Input
└────────────────────┴─────────────────────────────────────────────┘
   Sidebar (264px)              Main Chat Area (636px)
````

**Size:** ~900 × 700 pixels  
**Position:** Center of screen  
**Features:** Sidebar, chat, actions, search

---

## 4️⃣ UI States

### Empty State (No Messages)

```
┌─────────────────────────────┐
│                             │
│           👋                │
│                             │
│    Welcome to Sky           │
│      Assistant              │
│                             │
│   Start a conversation      │
│   by typing a message       │
│                             │
└─────────────────────────────┘
```

### Loading State (Sending Message)

```
┌─────────────────────────────┐
│  Your message              │
│                            │
│  ● ● ● Typing...           │  ← Animated dots
└─────────────────────────────┘
```

### Error State

```
┌─────────────────────────────┐
│           ⚠️                │
│                             │
│    Something went wrong    │
│                             │
│    [Try Again]             │
└─────────────────────────────┘
```

---

## 5️⃣ Action Button States

### Ready State

```
┌─────────────┐
│ Summarize   │  ← Blue background
└─────────────┘
```

### Loading State

```
┌─────────────┐
│ ⟳ Summarize │  ← Gray with spinner
└─────────────┘
```

### Completed State

```
┌─────────────┐
│ ✓ Summarize │  ← Green with checkmark
└─────────────┘
```

### Error State

```
┌─────────────┐
│ ⚠ Summarize │  ← Red with warning
└─────────────┘
```

---

## 6️⃣ Conversation List

### Normal View

```
┌──────────────────┐
│ Conversations    │
│                  │
│ [+] Search...    │
│                  │
│ • New Chat 1     │  ← Click to open
│   3 messages     │
│   2h ago         │
│                  │
│ • Ask about...   │
│   5 messages     │
│   5h ago         │
│                  │
│ • How to...      │
│   2 messages     │
│   1d ago         │
└──────────────────┘
```

### Swipe to Delete

```
┌──────────────────┐
│                  │
│ ←── • Chat       │  [🗑️] ← Swipe reveals delete
│                  │
└──────────────────┘
```

### Confirmation

```
┌──────────────────────┐
│                      │
│ • Chat  [Confirm?]   │  ← Click to confirm
│         [Cancel]     │
│                      │
└──────────────────────┘
```

---

## 7️⃣ Message Input

### Single Line

```
┌─────────────────────────────────────┐
│  Type your message...           [→] │
└─────────────────────────────────────┘
```

### Multi-Line (Auto-expands)

```
┌─────────────────────────────────────┐
│  This is a longer message           │
│  with multiple lines                │
│  that expands automatically...  [→] │
└─────────────────────────────────────┘
```

---

## 8️⃣ Code Blocks

### Rendered Code

```
┌──────────────────────────────────┐
│ typescript              [Copy]   │  ← Language + copy button
├──────────────────────────────────┤
│ const greeting = "Hello!";       │  ← Syntax highlighted
│ console.log(greeting);           │
└──────────────────────────────────┘
```

### After Copy

```
┌──────────────────────────────────┐
│ typescript            [Copied!]  │  ← Feedback
├──────────────────────────────────┤
│ const greeting = "Hello!";       │
│ console.log(greeting);           │
└──────────────────────────────────┘
```

---

## 9️⃣ Window Transitions

### Compact → Expanded

```
Frame 1:  [Small window]
          ↓ (Scale & opacity animation)
Frame 2:  [Medium window]
          ↓ (Continue animation)
Frame 3:  [Full window with sidebar fading in]
          ↓
Done:     [Fully expanded window]

Duration: ~300ms
FPS: 60
```

### Expanded → Compact

```
Frame 1:  [Full window]
          ↓ (Sidebar fades out)
Frame 2:  [Medium window]
          ↓ (Scale down animation)
Frame 3:  [Small window]
          ↓
Done:     [Compact floating window]

Duration: ~300ms
FPS: 60
```

---

## 🔟 Keyboard Interactions

### Input Box Focus

```
┌─────────────────────────────────────┐
│  |Type here...                  [→] │  ← Cursor visible
└─────────────────────────────────────┘
     ↑
  Blue focus ring
```

### Shortcuts Overlay (conceptual)

```
Ctrl + Space    →  Show/Hide window
Ctrl + Enter    →  Send message
Enter           →  New line
```

---

## Color Scheme

### Main Colors

- **Sky Accent:** `#3b82f6` (Blue) - Buttons, links
- **Text Primary:** `#1a1a1a` (Dark gray) - Main text
- **Text Secondary:** `#6b7280` (Gray) - Timestamps, labels
- **Background:** `rgba(255, 255, 255, 0.7)` - Translucent white
- **Border:** `rgba(255, 255, 255, 0.2)` - Subtle borders

### Button Colors

- **Green:** `#10b981` - Expand button
- **Yellow:** `#f59e0b` - Collapse button
- **Red:** `#ef4444` - Close/Delete
- **Gray:** `#6b7280` - Disabled

---

## Animation Details

### Message Entry

```
Opacity: 0 → 1  (200ms)
Y-position: 10px → 0px  (200ms)
Easing: ease-out
```

### Button Hover

```
Scale: 1 → 1.05  (150ms)
Easing: ease-in-out
```

### Button Tap

```
Scale: 1 → 0.95  (100ms)
Easing: ease-in-out
```

### Loading Dots

```
Opacity: 0.4 → 1 → 0.4  (1500ms loop)
Each dot delayed by 200ms
```

---

## Platform Differences

### Windows

```
Background: CSS blur (backdrop-filter)
Shortcut: Ctrl + Space
Close button: [×] (top-right)
```

### macOS

```
Background: Native vibrancy
Shortcut: Cmd + Space
Traffic lights: 🔴 🟡 🟢 (top-left)
```

---

## Responsive Behavior

### Compact Mode

- Minimum width: 380px
- Minimum height: 100px
- Can resize manually

### Expanded Mode

- Fixed width: 900px (centered)
- Fixed height: 700px (centered)
- Sidebar: 264px
- Chat area: 636px

---

## Visual Effects

### Blur Effect

```
Backdrop-filter: blur(40px)
Background: rgba(255, 255, 255, 0.7)
```

### Shadow

```
Box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15)
```

### Border Radius

```
Border-radius: 16px (all corners)
```

---

## That's What You'll See!

Run the app to experience:

- 🎨 Beautiful translucent UI
- ✨ Smooth 60fps animations
- 💬 Rich markdown chat
- 🚀 Fast and responsive
- 😊 Delightful interactions

**Launch command:**

```powershell
npm run electron:dev
```

Enjoy your Sky Desktop Assistant! 🎉
