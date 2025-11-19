# 🏗️ Architecture & Development Guide

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     Electron App                            │
├─────────────────────────────────────────────────────────────┤
│  Main Process (Node.js)          Renderer Process (Chrome) │
│  ├── Window Management            ├── React App            │
│  ├── Global Shortcuts             ├── Zustand Store        │
│  ├── IPC Handlers                 ├── Tailwind CSS         │
│  └── System Integration           └── Framer Motion        │
│                                                             │
│  Preload Script (Bridge)                                   │
│  └── Context-isolated IPC                                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy
```
App (Root)
├── ErrorBoundary
├── FloatingWindow (Compact Mode)
│   ├── MessageInput
│   └── ChatMessage (multiple)
│
└── ExpandedWindow (Full Mode)
    ├── ConversationList
    │   └── Conversation Items (with swipe-to-delete)
    ├── ChatMessage (multiple)
    ├── ActionTabs
    └── MessageInput
```

## State Management (Zustand)

### Store Structure
```typescript
AppState {
  // Window
  windowMode: 'compact' | 'expanded'
  
  // Data
  conversations: Conversation[]
  currentConversationId: string | null
  actions: Action[]
  
  // UI
  isInputFocused: boolean
  searchQuery: string
  
  // Preferences
  preferences: UserPreferences
}
```

### Persistence
- **Storage:** localStorage
- **Key:** `sky-assistant-storage`
- **Persisted Fields:**
  - conversations
  - currentConversationId
  - preferences
  - windowMode

## IPC Communication

### Main → Renderer
```typescript
// Window mode change notification
send('window-mode-changed', mode)
```

### Renderer → Main
```typescript
// Window controls
invoke('toggle-window-mode', mode?)
invoke('get-window-mode')
invoke('minimize-window')
invoke('close-window')
invoke('focus-window')

// Platform info
invoke('get-platform')
```

## Data Flow

### Sending a Message
```
User Types → MessageInput
                ↓
        handleSend() called
                ↓
      addMessage() to store
                ↓
    Zustand triggers re-render
                ↓
      ChatMessage appears
                ↓
  Auto-scroll to bottom
                ↓
    Persist to localStorage
```

### Window Mode Toggle
```
User Clicks Expand/Collapse
            ↓
  IPC: invoke('toggle-window-mode')
            ↓
    Main Process updates bounds
            ↓
 IPC: send('window-mode-changed')
            ↓
  Renderer updates state
            ↓
Framer Motion animates transition
```

## Animation System

### Framer Motion Patterns

#### Entry Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
```

#### Interactive Elements
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

#### Loading States
```typescript
<motion.div
  animate={{ opacity: [0.4, 1, 0.4] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
```

## Styling System

### Tailwind Layers
1. **Base Layer** - Reset & global styles
2. **Components Layer** - Reusable components
3. **Utilities Layer** - Single-purpose classes

### Custom Utilities
```css
.backdrop-blur-sky    /* 40px blur */
.rounded-sky          /* 16px radius */
.shadow-sky           /* Custom shadow */
.animate-fade-in      /* Fade in animation */
.animate-slide-up     /* Slide up animation */
```

### Platform-Specific Styles
```typescript
// macOS vibrancy (Electron)
vibrancy: 'sidebar'

// Windows fallback (CSS)
backdrop-filter: blur(40px)
background: rgba(255, 255, 255, 0.7)
```

## Edge Cases Handled

### ✅ Input Handling
- Rich text paste → sanitized to plain text
- Auto-expanding textarea (max 128px)
- Cmd/Ctrl+Enter to send
- Enter for new line

### ✅ Conversation Management
- Auto-generate titles from first message
- Search/filter conversations
- Swipe-to-delete with confirmation
- Persist across restarts

### ✅ Window Management
- Multi-monitor support
- Out-of-bounds detection
- Always-on-top mode
- Proper window state restoration

### ✅ Performance
- Message virtualization ready (react-window)
- Debounced search
- Optimistic UI updates
- Lazy load conversations

### ✅ Error Handling
- Error boundary for crashes
- Empty states
- Loading skeletons
- Network error states

## Build System

### Vite Configuration
```typescript
{
  plugins: [
    react(),           // React support
    electron({         // Electron integration
      main: 'electron/main.ts',
      preload: 'electron/preload.ts'
    })
  ]
}
```

### TypeScript Configuration
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** react-jsx
- **Strict:** true
- **Path Aliases:** `@/*` → `src/*`

### Build Process
1. **Vite builds renderer** → `dist/`
2. **TypeScript compiles Electron** → `dist-electron/`
3. **Electron Builder packages** → `release/`

## Security

### Context Isolation
✅ `contextIsolation: true`
✅ `nodeIntegration: false`
✅ Preload script with contextBridge

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline'; 
           style-src 'self' 'unsafe-inline';">
```

### IPC Validation
All IPC handlers validate input types

## Testing Strategy (Not Implemented)

### Unit Tests
- Zustand store actions
- Utility functions
- Component logic

### Integration Tests
- IPC communication
- Window state management
- Conversation persistence

### E2E Tests (Playwright)
- Full user flows
- Multi-window scenarios
- Platform-specific features

## Performance Optimization

### Implemented
- ✅ Framer Motion AnimatePresence
- ✅ React.memo where beneficial
- ✅ Debounced search
- ✅ Optimistic UI updates

### Ready for Large Scale
- 🔧 react-window for virtualization
- 🔧 Code splitting
- 🔧 Lazy component loading

## Platform Differences

### macOS Specifics
```typescript
if (process.platform === 'darwin') {
  window.setVibrancy('sidebar')
  // Native blur effect
}
```

### Windows Specifics
```css
/* CSS fallback */
backdrop-filter: blur(40px);
background-color: rgba(255, 255, 255, 0.7);
```

### Keyboard Shortcuts
- macOS: `Cmd + Key`
- Windows/Linux: `Ctrl + Key`

## Extending the App

### Adding a New Action
1. Edit `src/store/useAppStore.ts`
2. Add to `initialActions` array
3. Implement handler in `ActionTabs.tsx`

### Adding a New IPC Handler
1. Register in `electron/main.ts`
2. Expose in `electron/preload.ts`
3. Add type to `src/types/electron.d.ts`
4. Call from React component

### Adding a New Component
1. Create in `src/components/`
2. Import in parent component
3. Add types in `src/types/index.ts`
4. Style with Tailwind classes

## Common Patterns

### Async IPC Call
```typescript
const result = await window.electronAPI.someMethod(args)
```

### Zustand State Update
```typescript
const { someAction } = useAppStore()
someAction(value)
```

### Conditional Rendering
```typescript
{isEmpty ? <EmptyState /> : <Content />}
```

### Framer Motion List
```typescript
<AnimatePresence>
  {items.map(item => (
    <motion.div key={item.id} {...animations}>
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

## Debugging Tips

### Main Process
```bash
# Logs appear in terminal where you ran `npm run electron:dev`
console.log('Main process log')
```

### Renderer Process
```javascript
// Logs appear in DevTools (Cmd/Ctrl + Shift + I)
console.log('Renderer process log')
```

### State Debugging
```typescript
// View entire store state
const state = useAppStore.getState()
console.log(state)
```

### IPC Debugging
```typescript
// In main.ts
ipcMain.handle('some-method', (event, arg) => {
  console.log('IPC called with:', arg)
  return result
})
```

## File Organization Best Practices

### ✅ Do's
- One component per file
- Group related types together
- Use index files for exports
- Keep components under 300 lines

### ❌ Don'ts
- Don't mix concerns
- Don't use inline styles
- Don't hardcode values
- Don't skip TypeScript types

## Git Workflow (Recommended)

```bash
# Feature branch
git checkout -b feature/new-action

# Commit often
git add .
git commit -m "feat: add new action button"

# Push
git push origin feature/new-action

# Create PR
```

## Deployment Checklist

- [ ] Update version in package.json
- [ ] Test on all target platforms
- [ ] Run production build
- [ ] Test packaged app
- [ ] Sign app (macOS/Windows)
- [ ] Upload to release platform
- [ ] Update documentation

## Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy Coding! 🚀**
