# 📅 Calendar Integration - Quick Start

## Example Messages You Can Try

### Simple Events

```
Meeting tomorrow at 4pm
Lunch on Friday at 12:30
Dentist appointment next Monday at 9am
Call at 3:30pm tomorrow
Reminder to submit report on Wednesday at 5pm
```

### Events with Names/Descriptions

```
Meeting with John tomorrow at 4pm
Lunch with Sarah on Friday at 12:30pm
Coffee with the team next Tuesday at 10am
Video call with client on Thursday at 2pm
Dinner with family this Saturday at 7pm
```

### Specific Dates

```
Conference on May 15 at 9am
Birthday party on December 25 at 6pm
Doctor appointment on 2024-06-20 at 3pm
Team building on the 15th at 2pm
```

### Events with Duration

```
Meeting from 2pm to 4pm tomorrow
Workshop from 9am to 5pm on Friday
Lunch from 12:30 to 1:30 next Monday
Conference call from 3pm to 3:45pm today
```

### Recurring Patterns (Coming Soon)

Currently, the app creates single events. Recurring event support is planned for a future update.

## How to Use

1. **Type your message naturally** - Just write it like you would tell a friend
2. **The app detects calendar intent** - It recognizes keywords like "meeting", "appointment", "lunch"
3. **Review the parsed details** - A modal shows what will be created
4. **Confirm or cancel** - Click "Create Event" to add to your calendar

## Tips for Best Results

✅ **Include both date AND time**

- Good: "Meeting tomorrow at 3pm"
- Bad: "Meeting tomorrow" (time missing)

✅ **Use clear calendar keywords**

- meeting, appointment, lunch, dinner, call, reminder

✅ **Be specific with dates**

- "next Monday" is clearer than just "Monday"

✅ **Use standard time formats**

- 3pm, 15:00, 3:30 PM all work fine

## What Gets Created

The app extracts:

- **Title**: The event name (removes date/time words)
- **Date**: When it should happen
- **Start Time**: When it begins
- **End Time**: Defaults to 1 hour later if not specified

Example:

- Input: `"Team meeting with Sarah tomorrow at 2pm"`
- Title: `Team meeting with Sarah`
- Date: Tomorrow's date
- Time: 2:00 PM - 3:00 PM

## First-Time Setup

Before using calendar features:

1. Follow instructions in `GOOGLE_CALENDAR_SETUP.md`
2. Set up Google Cloud project
3. Enable Calendar API
4. Download credentials
5. Authenticate on first use

## Need Help?

See the full setup guide in `GOOGLE_CALENDAR_SETUP.md` for:

- Detailed setup instructions
- Troubleshooting tips
- Privacy information
- Advanced features
