# 📅 Google Calendar Integration - README

## Quick Overview

Your Sky Assistant now supports creating Google Calendar events through natural language! Just type messages like "Meeting with John tomorrow at 4pm" and the app will create the event for you.

## 📚 Documentation Files

### 1. **CALENDAR_IMPLEMENTATION.md** - Technical Details

- Complete feature overview
- Architecture diagram
- Code flow explanation
- Files created/modified
- Implementation details
- Testing checklist

### 2. **GOOGLE_CALENDAR_SETUP.md** - Setup Instructions

- Step-by-step Google Cloud setup
- OAuth2 configuration
- Credentials installation
- Authentication process
- Troubleshooting guide
- Privacy & security

### 3. **CALENDAR_EXAMPLES.md** - Usage Examples

- Example messages to try
- Tips for best results
- What gets created
- Quick start guide

## 🚀 Quick Start

### For Developers

1. **Read the implementation**: See `CALENDAR_IMPLEMENTATION.md` for technical details
2. **Set up Google Cloud**: Follow `GOOGLE_CALENDAR_SETUP.md`
3. **Test the feature**: Try examples from `CALENDAR_EXAMPLES.md`

### For End Users

1. **Setup required**: Follow `GOOGLE_CALENDAR_SETUP.md` to configure Google Calendar
2. **Start using**: Type natural language calendar messages
3. **Examples**: See `CALENDAR_EXAMPLES.md` for what you can say

## ✨ Key Features

- 🗣️ **Natural Language**: Just type how you would speak
- 🎯 **Smart Detection**: Automatically detects calendar intent
- 📝 **Event Parsing**: Extracts title, date, time automatically
- ✅ **Confirmation**: Review before creating
- 🔐 **Secure**: OAuth2 authentication
- 📱 **Cross-platform**: Works on Windows, Mac, Linux

## 📦 What's Included

### New Files:

- `src/services/nlp-parser.ts` - Natural language parser
- `src/services/google-calendar.ts` - Calendar API client
- `src/components/CalendarConfirmModal.tsx` - Confirmation UI
- `GOOGLE_CALENDAR_SETUP.md` - Setup guide
- `CALENDAR_EXAMPLES.md` - Usage examples
- `CALENDAR_IMPLEMENTATION.md` - Technical docs

### Modified Files:

- `electron/main.ts` - IPC handlers
- `electron/preload.ts` - API exposure
- `src/types/electron.d.ts` - Type definitions
- `src/components/FloatingWindow.tsx` - Integration point

### Dependencies Added:

- `chrono-node` - Natural language date parsing
- `googleapis` - Google Calendar API

## 🔧 Prerequisites

Before using calendar features:

1. ✅ Google account
2. ✅ Google Cloud project
3. ✅ Calendar API enabled
4. ✅ OAuth2 credentials
5. ✅ Credentials file installed

See `GOOGLE_CALENDAR_SETUP.md` for detailed instructions.

## 💡 Example Messages

```
Meeting with John tomorrow at 4pm
Lunch with Sarah on Friday at 12:30
Dentist appointment next Monday at 9am
Team standup from 9am to 9:30am tomorrow
Conference call on May 15 at 2pm
```

## 🔍 How It Works

1. User types a message
2. App detects calendar keywords
3. Parses event details (title, date, time)
4. Shows confirmation modal
5. User confirms
6. Creates event in Google Calendar
7. Shows success message with link

## 📋 Setup Checklist

- [ ] Read `GOOGLE_CALENDAR_SETUP.md`
- [ ] Create Google Cloud project
- [ ] Enable Calendar API
- [ ] Create OAuth2 credentials
- [ ] Download `credentials.json`
- [ ] Rename to `google-credentials.json`
- [ ] Place in user data directory
- [ ] Launch app
- [ ] Try: "Meeting tomorrow at 3pm"
- [ ] Complete OAuth in browser
- [ ] Verify event created

## 🎯 User Data Directory Locations

**Windows:**

```
C:\Users\<YourUsername>\AppData\Roaming\sky-assistant\google-credentials.json
```

**Mac:**

```
~/Library/Application Support/sky-assistant/google-credentials.json
```

**Linux:**

```
~/.config/sky-assistant/google-credentials.json
```

## 🐛 Troubleshooting

### "Calendar service not initialized"

→ Check `google-credentials.json` is in user data directory

### "Not authenticated"

→ Complete OAuth flow in browser

### "Failed to create event"

→ Check internet connection and API is enabled

See `GOOGLE_CALENDAR_SETUP.md` for more troubleshooting.

## 📖 Further Reading

- **Implementation Details**: `CALENDAR_IMPLEMENTATION.md`
- **Setup Guide**: `GOOGLE_CALENDAR_SETUP.md`
- **Usage Examples**: `CALENDAR_EXAMPLES.md`
- **chrono-node docs**: https://github.com/wanasit/chrono
- **Google Calendar API**: https://developers.google.com/calendar

## 🔒 Privacy

- Credentials stored locally only
- OAuth2 secure authentication
- No third-party data sharing
- Calendar scope only (read/write events)
- Can revoke access anytime

## 🎨 UI Design

The calendar confirmation modal matches your app's liquid glass aesthetic:

- Backdrop blur and transparency
- Mac-style red close button
- Smooth animations
- Dark mode support
- Loading states

## 🚧 Known Limitations

- Single events only (no recurring)
- Default 1-hour duration if not specified
- No location parsing yet
- No attendees support yet
- Internet required

## 🔮 Future Enhancements

Potential additions:

- Recurring events
- Add attendees via @mentions
- Location parsing
- View upcoming events
- Edit/delete events
- Voice input
- Smart suggestions

## 📝 Testing

Try these test messages:

1. "Meeting tomorrow at 3pm"
2. "Lunch with Sarah on Friday at 12:30"
3. "Dentist appointment May 15 at 10am"
4. "Team call from 2pm to 3pm next Monday"

## 💻 Development

### Build:

```bash
npm run build
```

### Dev Mode:

```bash
npm run dev
```

### Test Calendar:

1. Set up credentials
2. Run in dev mode
3. Type test messages
4. Check Google Calendar

## 📞 Support

If you encounter issues:

1. Check setup guide
2. Verify credentials
3. Check browser console
4. Review troubleshooting section
5. Ensure API is enabled

## 🎉 Success Criteria

Feature is working when:

- ✅ You can type "Meeting tomorrow at 3pm"
- ✅ Confirmation modal appears
- ✅ Event details are correct
- ✅ Click "Create Event"
- ✅ Event appears in Google Calendar
- ✅ Success message with link shows

## 🏁 You're Ready!

Your app now has production-ready Google Calendar integration! 🚀

**Next Steps:**

1. Read `GOOGLE_CALENDAR_SETUP.md` for setup
2. Configure Google Cloud credentials
3. Test with example messages
4. Share with users!

---

**Built with:** TypeScript, Electron, React, chrono-node, Google Calendar API

**License:** Check individual library licenses (chrono-node: MIT, googleapis: Apache 2.0)
