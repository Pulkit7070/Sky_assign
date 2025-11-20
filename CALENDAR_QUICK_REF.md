# 📅 Calendar Feature - Quick Reference

## ⚡ Getting Started

1. **Setup**: Follow `GOOGLE_CALENDAR_SETUP.md` (one-time only)
2. **Use**: Just type naturally!

## 💬 Example Messages

### Basic Events

```
Meeting tomorrow at 4pm
Lunch on Friday at 12:30
Call next Monday at 9am
```

### Events with People

```
Meeting with John tomorrow at 4pm
Lunch with Sarah on Friday at 12:30pm
Coffee with the team next Tuesday at 10am
```

### Specific Dates

```
Conference on May 15 at 9am
Birthday party on December 25 at 6pm
Doctor appointment on June 20 at 3pm
```

### With Duration

```
Meeting from 2pm to 4pm tomorrow
Workshop from 9am to 5pm on Friday
Lunch from 12:30 to 1:30 next Monday
```

## 🎯 Tips for Success

✅ **Include date AND time**

- Good: "Meeting tomorrow at 3pm"
- Bad: "Meeting tomorrow"

✅ **Use calendar keywords**

- meeting, appointment, lunch, dinner, call, etc.

✅ **Be specific with dates**

- "next Monday" not just "Monday"

✅ **Standard time formats**

- 3pm, 15:00, 3:30 PM all work

## 🔧 First-Time Setup

1. Get Google Cloud credentials
2. Place `google-credentials.json` in app data folder
3. Type your first calendar message
4. Click "Create Event"
5. Authenticate in browser
6. Done! No need to authenticate again

## 📍 Where to Put Credentials

**Windows:** `C:\Users\<You>\AppData\Roaming\sky-assistant\`  
**Mac:** `~/Library/Application Support/sky-assistant/`  
**Linux:** `~/.config/sky-assistant/`

## ❓ Common Issues

**"Not authenticated"**
→ Complete OAuth in browser

**"Calendar service not initialized"**
→ Check credentials.json location

**"Failed to parse"**
→ Include both date and time

## 📚 Need More Help?

- **Setup Guide**: `GOOGLE_CALENDAR_SETUP.md`
- **Examples**: `CALENDAR_EXAMPLES.md`
- **Technical**: `CALENDAR_IMPLEMENTATION.md`
- **Overview**: `CALENDAR_README.md`

## ✨ What Happens

1. Type message → 2. Modal shows → 3. Confirm → 4. ✅ Event created!

---

**That's it! Start creating calendar events by chatting naturally.** 🚀
