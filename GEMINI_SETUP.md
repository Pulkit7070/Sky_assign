# Gemini API Setup Guide

This guide will help you set up Google's Gemini 2.5 Flash API for Sky Assistant.

## Prerequisites

- Node.js 18+ installed
- Sky Assistant project cloned
- Google account

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy your API key (starts with `AI...`)

⚠️ **Important**: Keep your API key secret! Never commit it to git.

## Step 2: Configure Your Environment

1. Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:

   ```
   VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

3. Replace `YOUR_API_KEY_HERE` with your actual API key

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the App

```bash
npm run electron:dev
```

## Features

✅ **Brief Responses**: Gemini is configured to give concise answers (max 100 words)

✅ **Context Aware**: Remembers last 6 messages for better conversations

✅ **Works in Both Windows**: Available in floating and expanded modes

✅ **Calendar Integration**: Calendar feature still works perfectly

## Testing

1. Open Sky Assistant
2. Type a message like "What is AI?"
3. You should get a brief, intelligent response from Gemini
4. Try "Schedule a meeting tomorrow at 3pm" to test calendar integration

## Troubleshooting

### "Gemini API not configured" error

- Check that your `.env` file exists
- Verify the API key is correct
- Restart the app after adding the key

### API key not working

- Make sure there are no extra spaces in the `.env` file
- Verify the key is valid in [Google AI Studio](https://aistudio.google.com/apikey)
- Check you haven't exceeded free tier limits

### Responses are too long

The API is configured for ~100 words max. If responses are longer, check `src/services/gemini-service.ts` and adjust `maxOutputTokens`.

## API Limits (Free Tier)

- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**

For production use, consider upgrading to a paid plan.

## Security Notes

- ✅ `.env` file is in `.gitignore` (never committed)
- ✅ API key is client-side only (safe for desktop app)
- ⚠️ For web deployment, use a backend proxy (Supabase Edge Functions recommended)

## Next Steps

For production deployment with Supabase Edge Functions (recommended for web):

- See the main documentation provided
- Keeps API keys server-side
- Enables multi-device sync
- Better security and rate limiting
