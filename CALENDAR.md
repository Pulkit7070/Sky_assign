# Google Calendar Integration

Natural language calendar event creation integrated into the Sky Desktop Assistant.

## Quick Start

### Setup Requirements

1. Google account with Calendar access
2. Google Cloud project with Calendar API enabled
3. OAuth2 credentials configured
4. Credentials file placed in app data directory

See [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md) for detailed setup instructions.

### Usage

Type natural language messages to create calendar events:

**Simple Events**
```
Meeting tomorrow at 4pm
Lunch on Friday at 12:30
Dentist appointment next Monday at 9am
```

**Events with Duration**
```
Meeting from 2pm to 4pm tomorrow
Workshop from 9am to 5pm on Friday
Conference call from 3pm to 3:45pm today
```

**Named Events**
```
Meeting with John tomorrow at 4pm
Lunch with Sarah on Friday at 12:30pm
Coffee with the team next Tuesday at 10am
```

**Specific Dates**
```
Conference on May 15 at 9am
Birthday party on December 25 at 6pm
Team building on the 15th at 2pm
```

## How It Works

1. User types a message
2. App detects calendar keywords (meeting, lunch, appointment, etc.)
3. Natural language parser extracts event details
4. Confirmation modal displays parsed information
5. User confirms or cancels
6. Event is created in Google Calendar
7. Success message with event link appears

## Implementation Details

### Architecture

**Frontend Components**
- `CalendarConfirmModal.tsx` - Event confirmation UI
- `FloatingWindow.tsx` - Integration point with detection logic

**Services**
- `nlp-parser.ts` - Natural language date/time parsing using chrono-node
- `google-calendar.ts` - Calendar API client with OAuth2 flow

**Backend**
- `electron/main.ts` - IPC handlers for calendar operations
- `electron/preload.ts` - API exposure to renderer

### Event Parsing

The NLP parser extracts:
- **Title**: Event name with date/time words removed
- **Date**: Absolute date from relative expressions
- **Start Time**: When the event begins
- **End Time**: Either specified or defaults to 1 hour after start

Examples:
- Input: `"Team meeting with Sarah tomorrow at 2pm"`
- Title: `"Team meeting with Sarah"`
- Start: `[tomorrow's date] 14:00`
- End: `[tomorrow's date] 15:00`

### Authentication Flow

1. App checks for existing credentials
2. If not found, opens OAuth consent screen
3. User authorizes Calendar access
4. App receives authorization code
5. Code is exchanged for access token
6. Token is stored for future requests

### Credentials Location

**Windows**
```
C:\Users\<Username>\AppData\Roaming\sky-assistant\google-credentials.json
```

**macOS**
```
~/Library/Application Support/sky-assistant/google-credentials.json
```

**Linux**
```
~/.config/sky-assistant/google-credentials.json
```

## Tips for Best Results

**Include both date and time**
- Good: "Meeting tomorrow at 3pm"
- Poor: "Meeting tomorrow" (missing time)

**Use clear calendar keywords**
- meeting, appointment, lunch, dinner, call, reminder

**Be specific with dates**
- "next Monday" is clearer than just "Monday"
- "May 15" is clearer than "the 15th"

**Use standard time formats**
- Supported: 3pm, 15:00, 3:30 PM

## Troubleshooting

### "Calendar service not initialized"
Check that `google-credentials.json` exists in the correct location for your platform.

### "Not authenticated"
Complete the OAuth flow by clicking the authentication link when prompted.

### "Failed to create event"
- Verify internet connection
- Check that Calendar API is enabled in Google Cloud Console
- Ensure you have write access to your calendar

### Events not appearing
- Check the calendar you're signed into
- Verify the event was created in Google Calendar web interface
- Check for timezone issues

## Current Limitations

- Single events only (recurring events not supported)
- Default 1-hour duration if end time not specified
- No location parsing
- No attendee support
- Internet connection required

## Security and Privacy

- Credentials stored locally only
- OAuth2 secure authentication
- No third-party data sharing
- Limited to Calendar API scope
- Access can be revoked at any time from Google Account settings

## Technical Dependencies

- **googleapis** - Google Calendar API client
- **chrono-node** - Natural language date/time parsing
- Electron IPC for main/renderer communication

## Future Enhancements

Potential additions:
- Recurring event support
- Add attendees via @mentions
- Location detection and parsing
- View/edit/delete existing events
- Voice input support
- Smart time suggestions based on calendar availability
