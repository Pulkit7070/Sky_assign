/**
 * Natural Language Parser for Calendar Events
 * Extracts title, date, and time from user messages
 */

import * as chrono from 'chrono-node';

export interface ParsedEvent {
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  isValid: boolean;
  error?: string;
}

export class NLPParser {
  /**
   * Parse natural language text to extract calendar event details
   * Examples:
   * - "Meeting with John tomorrow at 4pm"
   * - "Lunch with Sarah on Friday at 12:30"
   * - "Team standup next Monday at 9am for 30 minutes"
   */
  static parseEventFromText(text: string): ParsedEvent {
    // Use chrono-node to parse date/time
    const parsed = chrono.parse(text);

    if (parsed.length === 0) {
      return {
        title: text,
        startDateTime: new Date(),
        endDateTime: new Date(),
        isValid: false,
        error: 'Could not parse date/time from message',
      };
    }

    const chronoResult = parsed[0];
    const startDateTime = chronoResult.start.date();

    // Determine end time (default 1 hour if not specified)
    let endDateTime: Date;
    if (chronoResult.end) {
      endDateTime = chronoResult.end.date();
    } else {
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    }

    // Extract title by removing date/time phrases
    const title = this.extractTitle(text, chronoResult.text);

    return {
      title: title || 'New Event',
      startDateTime,
      endDateTime,
      isValid: true,
    };
  }

  /**
   * Extract event title by removing date/time text
   */
  private static extractTitle(originalText: string, dateText: string): string {
    // Remove common prepositions and the date text
    let title = originalText
      .replace(new RegExp(dateText, 'gi'), '')
      .replace(/\b(at|on|for|in|from|to|tomorrow|today|next|this|last)\b/gi, '')
      .trim();

    // Clean up extra spaces
    title = title.replace(/\s+/g, ' ').trim();

    // Capitalize first letter
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    return title;
  }

  /**
   * Detect if message contains calendar-related keywords
   */
  static isCalendarIntent(text: string): boolean {
    const calendarKeywords = [
      'meeting',
      'appointment',
      'schedule',
      'event',
      'reminder',
      'call',
      'lunch',
      'dinner',
      'coffee',
      'sync',
      'standup',
      'review',
      'interview',
      'add to calendar',
      'calendar',
      'tomorrow',
      'next week',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    const lowerText = text.toLowerCase();
    return calendarKeywords.some((keyword) => lowerText.includes(keyword));
  }

  /**
   * Format parsed event for display
   */
  static formatEventSummary(event: ParsedEvent): string {
    if (!event.isValid) {
      return `❌ ${event.error}`;
    }

    const startStr = event.startDateTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const endStr = event.endDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `📅 ${event.title}\n🕐 ${startStr} - ${endStr}`;
  }
}
