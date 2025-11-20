/**
 * Google Calendar API Service
 * Handles OAuth2 authentication and calendar operations
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export interface CalendarEvent {
  summary: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  attendees?: string[];
}

export interface CalendarEventResult {
  success: boolean;
  eventId?: string;
  eventLink?: string;
  error?: string;
}

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client | null = null;
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private readonly TOKEN_PATH: string;
  private readonly CREDENTIALS_PATH: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.TOKEN_PATH = path.join(userDataPath, 'google-calendar-token.json');
    this.CREDENTIALS_PATH = path.join(userDataPath, 'google-credentials.json');
  }

  /**
   * Initialize OAuth2 client with credentials
   */
  async initialize(credentials: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  }): Promise<void> {
    const { client_id, client_secret, redirect_uris } = credentials;

    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Load saved token if exists
    await this.loadToken();
  }

  /**
   * Generate authorization URL for user to authenticate
   */
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async authenticateWithCode(code: string): Promise<void> {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Save token for future use
    await this.saveToken(tokens);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.oauth2Client !== null && this.oauth2Client.credentials.access_token !== undefined;
  }

  /**
   * Create a calendar event
   */
  async createEvent(eventData: CalendarEvent): Promise<CalendarEventResult> {
    try {
      if (!this.oauth2Client) {
        throw new Error('Not authenticated. Please sign in first.');
      }

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventData.endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: eventData.attendees?.map((email) => ({ email })),
        reminders: {
          useDefault: true,
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return {
        success: true,
        eventId: response.data.id || undefined,
        eventLink: response.data.htmlLink || undefined,
      };
    } catch (error: any) {
      console.error('Error creating calendar event:', error);
      
      // Handle token expiration
      if (error.code === 401) {
        this.oauth2Client = null;
        return {
          success: false,
          error: 'Authentication expired. Please sign in again.',
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to create calendar event',
      };
    }
  }

  /**
   * List upcoming events
   */
  async listUpcomingEvents(maxResults: number = 10): Promise<any[]> {
    if (!this.oauth2Client) {
      throw new Error('Not authenticated');
    }

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  /**
   * Save token to file
   */
  private async saveToken(tokens: any): Promise<void> {
    try {
      await fs.promises.writeFile(this.TOKEN_PATH, JSON.stringify(tokens));
    } catch (error) {
      // Silently fail token save
    }
  }

  /**
   * Load token from file
   */
  private async loadToken(): Promise<void> {
    try {
      if (!fs.existsSync(this.TOKEN_PATH)) {
        return;
      }

      const tokenData = await fs.promises.readFile(this.TOKEN_PATH, 'utf-8');
      const tokens = JSON.parse(tokenData);

      if (this.oauth2Client) {
        this.oauth2Client.setCredentials(tokens);
      }
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  /**
   * Sign out and clear tokens
   */
  async signOut(): Promise<void> {
    this.oauth2Client = null;
    
    try {
      if (fs.existsSync(this.TOKEN_PATH)) {
        await fs.promises.unlink(this.TOKEN_PATH);
      }
    } catch (error) {
      // Silently fail token clear
    }
  }
}
