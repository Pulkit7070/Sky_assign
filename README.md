# Sky Desktop Assistant

A floating AI desktop assistant with glassmorphism design, Google Calendar integration, and Gemini AI support. Built with Electron, React, and TypeScript.

## Features

**Core Functionality**
- Floating assistant with compact and expanded view modes
- AI-powered conversations using Google Gemini
- Google Calendar integration with natural language event creation
- Persistent chat history with conversation management
- Markdown rendering with code syntax highlighting

**User Interface**
- Glassmorphism design with backdrop blur effects
- Smooth animations and transitions
- Always-on-top frameless window
- Search across conversations
- Platform-specific styling (macOS/Windows)

**Developer Features**
- TypeScript for type safety
- Hot reload in development mode
- State management with Zustand
- IPC communication for calendar and AI features

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Windows 10+ or macOS 10.15+

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev
```

The app launches with hot-reload enabled. Changes to source files trigger automatic updates.

## Configuration

### Gemini AI Setup

1. Get an API key from Google AI Studio
2. Create a `.env` file in the project root
3. Add your key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

See [GEMINI_SETUP.md](GEMINI_SETUP.md) for detailed instructions.

### Google Calendar Setup

1. Create a Google Cloud project
2. Enable the Google Calendar API
3. Download OAuth credentials
4. Save as `google-credentials.json` in the app's user data directory

See [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md) for detailed instructions.

## Building for Production

```bash
# Build the application
npm run build

# Package for distribution
npm run electron:build
```

Build artifacts are created in the `release/` directory.

## Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+Space` (Windows)<br>`Cmd+Shift+Space` (macOS) | Toggle window visibility |
| `Ctrl+Enter` | Send message |
| `Enter` | New line in input |

### Calendar Integration

Create events using natural language:
- "Meeting with John tomorrow at 4pm"
- "Lunch on Friday at 12:30"
- "Dentist appointment next Monday at 9am"

The app detects calendar intent, parses event details, and shows a confirmation modal before creating the event.

### AI Conversations

The assistant uses Google Gemini to provide contextual responses. Conversation history is maintained and persisted locally.

## Project Structure

```
sky_assign/
├── electron/
│   ├── main.ts              # Main process with IPC handlers
│   └── preload.ts           # Context bridge for IPC
├── src/
│   ├── components/          # React components
│   │   ├── FloatingWindow.tsx
│   │   ├── ExpandedWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ConversationList.tsx
│   │   └── CalendarConfirmModal.tsx
│   ├── services/
│   │   ├── gemini-service.ts      # AI integration
│   │   ├── google-calendar.ts     # Calendar API
│   │   └── nlp-parser.ts          # Natural language parsing
│   ├── store/
│   │   └── useAppStore.ts         # Global state management
│   └── types/
│       ├── index.ts               # Type definitions
│       └── electron.d.ts          # Electron API types
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technology Stack

- **Electron 28+** - Desktop app framework
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Google Generative AI SDK** - Gemini integration
- **Google APIs** - Calendar integration
- **chrono-node** - Natural language date parsing

## Development

### Hot Reload
Changes to `.tsx`, `.ts`, and `.css` files trigger automatic reload.

### Debugging
- **Main Process**: Logs appear in terminal
- **Renderer Process**: Open DevTools with `Ctrl+Shift+I` (Windows) or `Cmd+Opt+I` (macOS)

### State Management
The app uses Zustand with localStorage persistence. To reset state:
1. Open DevTools
2. Navigate to Application → Local Storage
3. Delete the `sky-assistant-storage` key

## Troubleshooting

### Hotkey Conflicts
The default shortcut may conflict with other applications. The app tries fallback shortcuts automatically. To customize, edit `electron/main.ts`.

### Window Position Issues
If the window appears off-screen:
1. Close the app
2. Delete the window state file from your OS's app data directory
3. Restart the app

### Build Errors on Windows
Ensure you have:
- Latest Node.js LTS version
- Visual Studio Build Tools (for native modules)
- Run `npm install` with administrator privileges if needed

### Calendar Not Working
- Verify `google-credentials.json` is in the correct location
- Complete OAuth authentication in the browser
- Check that the Calendar API is enabled in Google Cloud Console

### Empty AI Responses
- Verify your `GEMINI_API_KEY` is set correctly in `.env`
- Check your internet connection
- Review terminal logs for specific error messages

## Platform Notes

### macOS
- Native vibrancy effects
- Wallpaper-aware tinting
- Traffic light button spacing

### Windows
- CSS backdrop blur fallback
- Windows 11 styled corners

### Linux
- Same as Windows
- Blur effects may not work on all desktop environments

## License

MIT License - See LICENSE file for details

## Documentation

- [Gemini AI Setup](GEMINI_SETUP.md) - Configure AI integration
- [Google Calendar Setup](GOOGLE_CALENDAR_SETUP.md) - Calendar integration guide
- [Architecture](ARCHITECTURE.md) - Technical architecture details
- [Design System](DESIGN_SYSTEM.md) - UI/UX design specifications
