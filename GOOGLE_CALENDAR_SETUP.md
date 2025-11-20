# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for your Sky Assistant app.

## Overview

The app now supports natural language calendar event creation. Users can type messages like:

- "Meeting with John tomorrow at 4pm"
- "Lunch with Sarah on Friday at 12:30"
- "Dentist appointment next Monday at 2pm"

The app will automatically detect calendar intents, parse the event details, and create events in Google Calendar.

## Prerequisites

- Google Cloud Console account
- Google Calendar enabled on your Google account

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Sky Assistant Calendar"
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In the Cloud Console, ensure your project is selected
2. Go to **APIs & Services** → **Library**
3. Search for "Google Calendar API"
4. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:

   - User Type: **External**
   - App name: **Sky Assistant**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/calendar`
   - Test users: Add your email
   - Click **Save and Continue**

4. Back to creating OAuth client ID:

   - Application type: **Desktop app**
   - Name: **Sky Assistant Desktop**
   - Click **Create**

5. Download the credentials:
   - Click the **Download** button (download icon)
   - Save the file as `credentials.json`

## Step 4: Install Credentials

1. Locate the downloaded `credentials.json` file
2. Move it to your app's user data directory:

   **Windows:**

   ```
   C:\Users\<YourUsername>\AppData\Roaming\sky-assistant\
   ```

   **Mac:**

   ```
   ~/Library/Application Support/sky-assistant/
   ```

   **Linux:**

   ```
   ~/.config/sky-assistant/
   ```

3. Rename it to `google-credentials.json`

### Alternative: Development Testing

For development, you can also place the file in the project root and the app will copy it to the user data directory on first run.

## Step 5: First-Time Authentication

1. Start the Sky Assistant app
2. Type a calendar message like: **"Meeting tomorrow at 3pm"**
3. The app will show a confirmation modal with the parsed event details
4. Click **"Create Event"**
5. Your default browser will open with Google's OAuth consent screen
6. Sign in with your Google account
7. Grant permissions to Sky Assistant
8. You'll be redirected to a page with an authorization code
9. Copy the code from the URL (everything after `code=`)
10. The app will automatically use this code to complete authentication

**Note:** After the first authentication, the app will save your tokens and you won't need to authenticate again unless you sign out or tokens expire.

## Step 6: Test the Integration

Try these example messages:

1. **"Lunch with Sarah tomorrow at 12:30"**

   - Creates: Lunch with Sarah
   - Time: Tomorrow at 12:30 PM (1 hour duration)

2. **"Team meeting next Monday at 2pm"**

   - Creates: Team meeting
   - Time: Next Monday at 2:00 PM

3. **"Call with client on Friday from 3pm to 4pm"**

   - Creates: Call with client
   - Time: Friday 3:00 PM - 4:00 PM

4. **"Dentist appointment May 15 at 10am"**
   - Creates: Dentist appointment
   - Time: May 15 at 10:00 AM

## How It Works

1. **Intent Detection**: The app checks if your message contains calendar-related keywords (meeting, appointment, lunch, etc.)

2. **Natural Language Parsing**: Uses chrono-node library to extract dates and times from your message

3. **Event Extraction**: Intelligently removes temporal phrases to get the event title

4. **Confirmation**: Shows a modal with parsed details for you to review

5. **Creation**: On confirmation, creates the event in your Google Calendar via API

6. **Response**: Displays success message with a link to view the event

## Supported Patterns

### Keywords Detected:

- meeting, appointment, schedule, event
- lunch, dinner, breakfast, call
- reminder, deadline, due date
- and 20+ more calendar-related terms

### Date Formats:

- Relative: tomorrow, next Monday, this Friday
- Absolute: May 15, December 25th, 2024-06-10
- Natural: in 2 days, next week, next month

### Time Formats:

- 12-hour: 3pm, 4:30am, 2:15 PM
- 24-hour: 14:00, 16:30
- Natural: at noon, at midnight

### Duration:

- Explicit: "from 2pm to 4pm"
- Implicit: Defaults to 1 hour if not specified

## Troubleshooting

### "Calendar service not initialized"

- Ensure `google-credentials.json` exists in the user data directory
- Check that the file is valid JSON with correct OAuth credentials

### "Not authenticated"

- Complete the OAuth flow in your browser
- Ensure you granted calendar permissions
- Check that tokens are being saved (look for `google-calendar-token.json`)

### "Authentication expired"

- The app will automatically prompt you to re-authenticate
- Click the authentication link and follow the OAuth flow again

### "Failed to create event"

- Check your internet connection
- Verify Google Calendar API is enabled in Cloud Console
- Ensure your OAuth credentials are valid
- Check browser console for detailed error messages

### Events not parsing correctly

- Include both date and time in your message
- Use clear keywords like "meeting" or "appointment"
- Avoid ambiguous phrases
- Be specific with dates (e.g., "next Monday" instead of "Monday")

## Privacy & Security

- Your credentials and tokens are stored locally on your device
- The app only requests calendar scope (read/write calendar events)
- No data is sent to external servers except Google's API
- You can revoke access anytime from [Google Account Permissions](https://myaccount.google.com/permissions)

## Signing Out

To disconnect Google Calendar:

1. Open Settings modal
2. Look for "Sign out from Google Calendar" option (coming soon)
3. Or manually delete the token file from your user data directory

## Development Notes

### File Structure:

```
src/services/
├── nlp-parser.ts          # Natural language parsing logic
└── google-calendar.ts     # Google Calendar API client

electron/
└── main.ts                # IPC handlers for calendar operations

src/components/
├── CalendarConfirmModal.tsx  # Confirmation modal UI
└── FloatingWindow.tsx        # Main integration point
```

### Key Functions:

- `NLPParser.parseEventFromText()` - Parse text to event
- `NLPParser.isCalendarIntent()` - Detect calendar keywords
- `GoogleCalendarService.createEvent()` - Create calendar event
- `handleCalendarConfirm()` - Confirm and create event flow

## Future Enhancements

Potential improvements:

- [ ] Recurring events support
- [ ] Add attendees via email mentions
- [ ] Voice input for event creation
- [ ] View upcoming events in app
- [ ] Edit/delete existing events
- [ ] Multiple calendar support
- [ ] Timezone handling improvements
- [ ] Location parsing and maps integration
- [ ] Smart suggestions based on patterns

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all setup steps were completed
3. Review the troubleshooting section
4. Check Google Cloud Console for API quotas
5. Ensure OAuth credentials are correctly configured

## License

This integration uses:

- **chrono-node**: MIT License
- **googleapis**: Apache 2.0 License
- **Google Calendar API**: Subject to Google API Terms of Service

---

**Note**: Keep your `credentials.json` and `token.json` files private. Never commit them to version control or share them publicly.
