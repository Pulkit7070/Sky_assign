# Sky Desktop Assistant ✨

Your intelligent floating companion that lives on your desktop. Sky combines AI conversations, smart calendar scheduling, and local place discovery—all wrapped in a beautiful glassmorphism design.

## What Makes Sky Special?

**🤖 Smart AI Conversations**
Chat naturally with Google Gemini AI. Ask questions, brainstorm ideas, or get help with anything. Your conversations are saved and searchable, so you never lose context.

**📅 Calendar That Understands You**
Just type "Meeting with Sarah tomorrow at 3pm" and Sky knows what to do. No forms, no date pickers—just natural language that creates Google Calendar events instantly.

**📍 Find Places Around You**
Looking for nearby restaurants, cafes, or gas stations? Sky uses free OpenStreetMap data to discover places around you—completely free, no API keys needed.

**🎨 Beautiful & Unobtrusive**
Floats elegantly on your desktop with a glassmorphic design that adapts to your wallpaper. Expand when you need more space, collapse when you don't. Always there, never in the way.

**⚡ Built for Speed**
Fast hot-reload development, TypeScript safety, and smooth animations powered by Framer Motion. It just feels good to use.

## Getting Started

### What You'll Need

- Node.js 18+ (grab it from [nodejs.org](https://nodejs.org))
- A modern computer running Windows 10+, macOS 10.15+, or Linux
- 5 minutes of your time

### Installation

Clone the repo and get it running:

```bash
# Install all the dependencies
npm install

# Fire it up in dev mode
npm run electron:dev
```

That's it! The app will launch with hot-reload enabled, so any changes you make will update automatically.

## Setting It Up

### Gemini AI (Required for chat)

You'll need a free API key from Google:

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key (it's free!)
3. Create a `.env` file in the project root
4. Add this line:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

Need more help? Check out [GEMINI_SETUP.md](GEMINI_SETUP.md) for the full walkthrough.

### Google Calendar (Optional)

Want calendar superpowers? Set up OAuth:

1. Create a Google Cloud project
2. Enable the Calendar API
3. Download your OAuth credentials
4. Save them as `google-credentials.json` in the app's data folder

The first time you create an event, Sky will walk you through authentication. Full guide: [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)

### OpenStreetMap Places (Already configured!)

The location search feature works right out of the box—no API keys, no billing, completely free. Just start searching for places near you!

## Building for Production

Ready to share Sky or run it outside of dev mode?

```bash
# Build everything
npm run build

# Package it up for your OS
npm run electron:build
```

You'll find your shiny new app in the `release/` folder. Double-click and enjoy!

Build artifacts are created in the `release/` directory.

## How to Use Sky

### Keyboard Shortcuts

| Shortcut                                            | What it does      |
| --------------------------------------------------- | ----------------- |
| `Ctrl+Shift+Space` (Win)<br>`Cmd+Shift+Space` (Mac) | Show/hide Sky     |
| `Ctrl+Enter`                                        | Send your message |
| `Enter`                                             | Add a new line    |

### Creating Calendar Events

Just type naturally—Sky understands:

- "Meeting with John tomorrow at 4pm"
- "Lunch on Friday at 12:30"
- "Dentist appointment next Monday at 9am"
- "Workshop from 2pm to 5pm on the 15th"

Sky will show you a preview before creating anything, so you're always in control.

### Finding Places Nearby

Looking for something close by? Try:

- "Find restaurants near me"
- "Coffee shops nearby"
- "Gas stations around here"
- "Find grocery stores"

Sky uses your location (or IP-based approximation) to search OpenStreetMap and show you relevant places with distances.

### Chat with AI

Ask Sky anything! It uses Google Gemini to:

- Answer questions
- Help with coding problems
- Explain complex topics
- Brainstorm ideas
- And much more

Your chat history is saved locally, so you can pick up where you left off.

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

## What's Under the Hood?

Built with modern tools for the best experience:

- **Electron 28+** — Cross-platform desktop magic
- **React 18** — Smooth, reactive UI
- **TypeScript 5** — Catch bugs before they happen
- **Vite** — Lightning-fast development
- **Tailwind CSS v4** — Beautiful styling made easy
- **Zustand** — Simple, powerful state management
- **Framer Motion** — Buttery smooth animations
- **Google Gemini AI** — Intelligent conversations
- **Google Calendar API** — Smart event scheduling
- **OpenStreetMap** — Free place discovery (Photon + Nominatim)
- **chrono-node** — Natural language date parsing

## Development Tips

### Hot Reload is Your Friend

Edit any `.tsx`, `.ts`, or `.css` file and watch Sky update instantly. No manual restarts needed.

### Debugging Made Easy

- **Main Process logs**: Check your terminal
- **Renderer Process**: Hit `Ctrl+Shift+I` (Win) or `Cmd+Opt+I` (Mac) to open DevTools

### Resetting Everything

If things get wonky, reset the app state:

1. Open DevTools (`Ctrl+Shift+I`)
2. Go to Application → Local Storage
3. Delete the `sky-assistant-storage` key
4. Refresh and start fresh

## Common Issues & Fixes

### "The hotkey doesn't work!"

Sky's default shortcut might clash with another app. Don't worry—Sky tries fallback shortcuts automatically. Want to customize it? Edit the hotkey registration in `electron/main.ts`.

### "The window disappeared!"

Sometimes Sky ends up off-screen (especially with multi-monitor setups):

1. Close Sky completely
2. Delete the window state file from your app data folder
3. Restart—Sky will reposition itself

### "Build failed on Windows!"

Make sure you have:

- The latest Node.js LTS
- Visual Studio Build Tools (needed for native modules)
- Try running `npm install` as administrator if all else fails

### "Calendar events aren't creating!"

Quick checklist:

- Is `google-credentials.json` in the right place?
- Did you complete the OAuth login in your browser?
- Is the Calendar API enabled in your Google Cloud Console?

### "AI isn't responding!"

Three things to check:

- Is `GEMINI_API_KEY` in your `.env` file?
- Is your internet connection working?
- Check the terminal—error messages will point you in the right direction

### "Location search isn't working!"

The OpenStreetMap integration is free and requires no setup, but:

- Make sure you have an internet connection
- Check if your browser/system allows location access
- If geolocation fails, Sky falls back to IP-based location (less accurate but still works!)

## Platform-Specific Polish

### macOS

Sky uses native vibrancy effects that adapt to your wallpaper, plus proper spacing for traffic light buttons. It feels right at home.

### Windows

Styled for Windows 11 with rounded corners and smooth blur effects. Looks great on Windows 10 too!

### Linux

Same great experience as Windows. Note: blur effects depend on your desktop environment's compositor.

## License

MIT License - See LICENSE file for details

## More Documentation

Want to dive deeper?

- **[Gemini AI Setup](GEMINI_SETUP.md)** — Get your API key and configure the AI
- **[Google Calendar Setup](GOOGLE_CALENDAR_SETUP.md)** — Full OAuth walkthrough
- **[OpenStreetMap Setup](OSM_SETUP.md)** — Learn about the free location features
- **[Architecture](ARCHITECTURE.md)** — How Sky is built under the hood
- **[Design System](DESIGN_SYSTEM.md)** — UI/UX design philosophy and components

## Contributing

Found a bug? Have an idea? Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License — See the LICENSE file for details.

---

Built with ❤️ using Electron, React, and TypeScript
