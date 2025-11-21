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

export interface ParsedLocationQuery {
  type: 'nearby' | 'text';
  query: string;
  placeType?: string; // restaurant, cafe, grocery_store, etc.
  keyword?: string;
  location?: string; // city name or address
  useCurrentLocation: boolean;
  isValid: boolean;
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

    // Determine end time
    let endDateTime: Date;
    if (chronoResult.end) {
      // End time explicitly mentioned (e.g., "from 2pm to 4pm")
      endDateTime = chronoResult.end.date();
    } else {
      // Check for duration mentions (e.g., "for 30 minutes", "for 2 hours")
      const duration = this.extractDuration(text);
      endDateTime = new Date(startDateTime.getTime() + duration);
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
   * Extract duration from text in milliseconds
   * Supports: "for X minutes", "for X hours", "for X mins", "for X h"
   * Default: 1 hour
   */
  private static extractDuration(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Match patterns like "for 30 minutes", "for 2 hours", "for 45 mins"
    const minutesMatch = lowerText.match(/for\s+(\d+)\s*(minutes?|mins?|m)\b/);
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch[1]);
      return minutes * 60 * 1000; // Convert to milliseconds
    }

    const hoursMatch = lowerText.match(/for\s+(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b/);
    if (hoursMatch) {
      const hours = parseFloat(hoursMatch[1]);
      return hours * 60 * 60 * 1000; // Convert to milliseconds
    }

    // Also support "X hour meeting", "X minute call" patterns
    const implicitHoursMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(hour|hr)\s*(meeting|call|appointment|event)/);
    if (implicitHoursMatch) {
      const hours = parseFloat(implicitHoursMatch[1]);
      return hours * 60 * 60 * 1000;
    }

    const implicitMinutesMatch = lowerText.match(/(\d+)\s*(minute|min)\s*(meeting|call|appointment|event)/);
    if (implicitMinutesMatch) {
      const minutes = parseInt(implicitMinutesMatch[1]);
      return minutes * 60 * 1000;
    }

    // Default to 1 hour
    return 60 * 60 * 1000;
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

    // Remove duration mentions from title
    title = title.replace(/for\s+\d+(?:\.\d+)?\s*(minutes?|mins?|hours?|hrs?|m|h)\b/gi, '').trim();
    title = title.replace(/\d+(?:\.\d+)?\s*(minute|min|hour|hr)\s*(meeting|call|appointment|event)/gi, '$2').trim();

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
   * Detect if message is a location/places search query
   */
  static isLocationIntent(text: string): boolean {
    const locationKeywords = [
      'find',
      'search',
      'near me',
      'nearby',
      'closest',
      'nearest',
      'around',
      'in the area',
      'where can i',
      'locate',
      'directions',
      'map',
      'places',
      'show me',
      'looking for',
      'restaurant',
      'restaurants',
      'cafe',
      'cafes',
      'coffee shop',
      'coffee shops',
      'grocery',
      'store',
      'stores',
      'shop',
      'shops',
      'mall',
      'malls',
      'hospital',
      'hospitals',
      'hotel',
      'hotels',
      'gas station',
      'gas stations',
      'bank',
      'banks',
      'atm',
      'pharmacy',
      'pharmacies',
    ];

    const lowerText = text.toLowerCase();
    return locationKeywords.some((keyword) => lowerText.includes(keyword));
  }

  /**
   * Parse location query from text
   * Examples:
   * - "find restaurants near me"
   * - "grocery stores in Delhi"
   * - "coffee shops nearby"
   * - "show me hospitals near Connaught Place"
   */
  static parseLocationQuery(text: string): ParsedLocationQuery {
    const lowerText = text.toLowerCase();

    // Check if user wants current location (check this FIRST before extracting location)
    const useCurrentLocation = /near me|nearby|around here|closest|nearest|close to me|around me/i.test(text);

    // Extract place types
    const placeTypePatterns: Record<string, string[]> = {
      restaurant: ['restaurant', 'restaurants', 'dining', 'eat'],
      cafe: ['cafe', 'coffee shop', 'coffee', 'cafes'],
      grocery_store: ['grocery', 'supermarket', 'market'],
      shopping_mall: ['mall', 'shopping', 'shops'],
      hospital: ['hospital', 'clinic', 'medical'],
      hotel: ['hotel', 'hotels', 'accommodation'],
      gas_station: ['gas station', 'petrol', 'fuel'],
      bank: ['bank', 'atm'],
      pharmacy: ['pharmacy', 'drugstore', 'chemist'],
      park: ['park', 'garden'],
      gym: ['gym', 'fitness', 'workout'],
      school: ['school', 'college', 'university'],
    };

    let placeType: string | undefined;
    let keyword: string | undefined;

    for (const [type, patterns] of Object.entries(placeTypePatterns)) {
      if (patterns.some(pattern => lowerText.includes(pattern))) {
        placeType = type;
        break;
      }
    }

    // Extract location (city or place name) - but NOT if it's "near me" or "nearby"
    let location: string | undefined;
    
    if (!useCurrentLocation) {
      // Only look for location if NOT using current location
      const locationMatch = text.match(/\b(?:in|near|at|around)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$)/i);
      if (locationMatch) {
        const extractedLocation = locationMatch[1].trim().toLowerCase();
        // Ignore if it's "me" or similar
        if (extractedLocation !== 'me' && extractedLocation !== 'here') {
          location = locationMatch[1].trim();
        }
      }
    }

    // Extract keyword if present (e.g., "find pizza restaurants")
    const keywordMatch = text.match(/(?:find|search|looking for|show me)\s+([a-z\s]+?)\s+(?:restaurant|cafe|shop|store|near|in)/i);
    if (keywordMatch && !placeType) {
      keyword = keywordMatch[1].trim();
    }

    // Determine query type
    const type: 'nearby' | 'text' = useCurrentLocation ? 'nearby' : 'text';

    return {
      type,
      query: text,
      placeType,
      keyword,
      location,
      useCurrentLocation,
      isValid: true,
    };
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
