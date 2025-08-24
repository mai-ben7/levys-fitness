import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// In-memory storage for trainer tokens (in production, use a database)
// Note: This gets reset when the server restarts
const trainerTokens: { [key: string]: any } = {};

// For development, we can store tokens in a file or use a simple persistence
// This is a temporary solution - in production use a proper database
const TOKENS_FILE = join(process.cwd(), '.tokens.json');

// Load tokens from file on startup
function loadTokensFromFile() {
  try {
    if (existsSync(TOKENS_FILE)) {
      const fileContent = readFileSync(TOKENS_FILE, 'utf8');
      const tokens = JSON.parse(fileContent);
      Object.assign(trainerTokens, tokens);
      console.log('Loaded tokens from file:', Object.keys(trainerTokens));
    }
  } catch (error) {
    console.log('No existing tokens file found');
  }
}

// Save tokens to file
function saveTokensToFile() {
  try {
    writeFileSync(TOKENS_FILE, JSON.stringify(trainerTokens, null, 2));
    console.log('Saved tokens to file');
  } catch (error) {
    console.error('Failed to save tokens to file:', error);
  }
}

// Load tokens on module initialization
loadTokensFromFile();

// Google OAuth2 configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Google Calendar API
const calendar = google.calendar({ version: 'v3' });

export async function getAuthUrl(): Promise<string> {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}

export async function getTokensFromCode(code: string): Promise<any> {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function storeTrainerTokens(email: string, tokens: any) {
  trainerTokens[email] = tokens;
  console.log(`Stored tokens for ${email}:`, Object.keys(trainerTokens));
  saveTokensToFile(); // Save to file after storing
}

export function getTrainerTokens(email: string) {
  const tokens = trainerTokens[email];
  console.log(`Getting tokens for ${email}:`, tokens ? 'Found' : 'Not found');
  return tokens;
}

export async function testConnection(email: string): Promise<boolean> {
  const tokens = getTrainerTokens(email);
  if (!tokens) {
    return false;
  }

  try {
    oauth2Client.setCredentials(tokens);
    const calendarId = process.env.TRAINER_CALENDAR_ID || 'primary';
    
    // Try a simple API call to test the connection
    await calendar.calendars.get({
      auth: oauth2Client,
      calendarId: calendarId
    });
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

export async function createDefaultAvailability(email: string, date: string): Promise<void> {
  const tokens = getTrainerTokens(email);
  if (!tokens) {
    throw new Error('Trainer not authenticated');
  }

  oauth2Client.setCredentials(tokens);
  const calendarId = process.env.TRAINER_CALENDAR_ID || 'primary';

  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // 9 AM
  
  const endOfDay = new Date(date);
  endOfDay.setHours(18, 0, 0, 0); // 6 PM

  try {
    const event = {
      summary: 'Availability',
      description: 'Default working hours - created automatically by booking system',
      start: {
        dateTime: startOfDay.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      end: {
        dateTime: endOfDay.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      colorId: '4', // Blue color
      transparency: 'transparent'
    };

    await calendar.events.insert({
      auth: oauth2Client,
      calendarId: calendarId,
      requestBody: event
    });

    console.log('Created default availability event for', date);
  } catch (error) {
    console.error('Failed to create default availability event:', error);
  }
}

export async function createCustomAvailability(
  email: string, 
  date: string, 
  startHour: number, 
  endHour: number
): Promise<void> {
  const tokens = getTrainerTokens(email);
  if (!tokens) {
    throw new Error('Trainer not authenticated');
  }

  oauth2Client.setCredentials(tokens);
  const calendarId = process.env.TRAINER_CALENDAR_ID || 'primary';

  const startOfDay = new Date(date);
  startOfDay.setHours(startHour, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(endHour, 0, 0, 0);

  try {
    const event = {
      summary: 'Availability',
      description: `Custom working hours ${startHour}:00-${endHour}:00`,
      start: {
        dateTime: startOfDay.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      end: {
        dateTime: endOfDay.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      colorId: '4', // Blue color
      transparency: 'transparent'
    };

    await calendar.events.insert({
      auth: oauth2Client,
      calendarId: calendarId,
      requestBody: event
    });

    console.log(`Created custom availability event for ${date}: ${startHour}:00-${endHour}:00`);
  } catch (error) {
    console.error('Failed to create custom availability event:', error);
  }
}

interface ServiceConfig {
  id: string;
  label: string;
  duration: number;
  buffer: number;
}

interface TimeSlot {
  start: string;
  end: string;
}

export async function getAvailableSlots(
  trainerEmail: string,
  date: string,
  serviceConfig?: ServiceConfig
): Promise<{ start: string; end: string }[]> {
  console.log('[slots] === GET AVAILABLE SLOTS CALLED ===');
  console.log('[slots] Email:', trainerEmail);
  console.log('[slots] Date:', date);
  console.log('[slots] Service config:', serviceConfig);

  const tokens = getTrainerTokens(trainerEmail);
  if (!tokens) {
    throw new Error('Trainer not authenticated');
  }

  oauth2Client.setCredentials(tokens);

  const calendarId = process.env.TRAINER_CALENDAR_ID || 'primary';
  const timeZone = 'Asia/Jerusalem';
  const durationMin = serviceConfig?.duration || 60;
  const bufferMin = serviceConfig?.buffer || 10;

  console.log('[slots] Config - timeZone:', timeZone, 'durationMin:', durationMin, 'bufferMin:', bufferMin);

  try {
    // Parse the date and create time boundaries
    const selectedDate = new Date(date + 'T00:00:00');
    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    console.log('[slots] Current time:', new Date().toLocaleTimeString('he-IL'));

    // Get all events for the day
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: timeZone
    });

    const allEvents = response.data.items || [];
    console.log('[slots] All events found:', allEvents.length);

    // Get busy intervals from all events (except availability events)
    const busy: { start: Date; end: Date }[] = [];
    const availabilityEvents: any[] = [];

    for (const event of allEvents) {
      const title = (event.summary || '').toLowerCase();
      const isAvailability = /availability|available|open|slot|זמינות|פתוח/.test(title);
      
      if (isAvailability) {
        availabilityEvents.push(event);
      } else if (event.start?.dateTime && event.end?.dateTime) {
        // This is a busy event
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        busy.push({ start, end });
      }
    }

    console.log('[slots] Busy intervals:', busy.map(b => 
      `${b.start.toLocaleTimeString('he-IL')}–${b.end.toLocaleTimeString('he-IL')}`
    ));

    console.log('[slots] Availability events found:', availabilityEvents.length);
    availabilityEvents.forEach((event: any, index: number) => {
      console.log(`[slots] Event ${index + 1}:`, {
        title: event.summary,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date
      });
    });

    // Build availability windows
    const windows: { start: Date; end: Date }[] = [];

    if (availabilityEvents.length === 0) {
      // Default window 9-18
      const wStart = new Date(startOfDay);
      wStart.setHours(9, 0, 0, 0);
      const wEnd = new Date(startOfDay);
      wEnd.setHours(18, 0, 0, 0);
      windows.push({ start: wStart, end: wEnd });
      console.log('[slots] Using default window: 09:00-18:00');
    } else {
      // Process each availability event
      for (const event of availabilityEvents) {
        let evStart: Date;
        let evEnd: Date;

        if (event.start?.dateTime && event.end?.dateTime) {
          // Timed event
          evStart = new Date(event.start.dateTime);
          evEnd = new Date(event.end.dateTime);
        } else if (event.start?.date && event.end?.date) {
          // All-day event - use the whole day
          evStart = new Date(startOfDay);
          evEnd = new Date(endOfDay);
        } else {
          continue; // Skip invalid events
        }

        // Clamp to the selected day
        const clampedStart = new Date(Math.max(evStart.getTime(), startOfDay.getTime()));
        const clampedEnd = new Date(Math.min(evEnd.getTime(), endOfDay.getTime()));
        
        if (clampedEnd > clampedStart) {
          windows.push({ start: clampedStart, end: clampedEnd });
          console.log(`[slots] Added window: ${clampedStart.toLocaleTimeString('he-IL')} - ${clampedEnd.toLocaleTimeString('he-IL')}`);
        }
      }
    }

    // Helper function to check if a slot overlaps with busy times
    function overlapsBusy(slotStart: Date, slotEnd: Date): boolean {
      return busy.some(busyEvent => 
        slotStart < busyEvent.end && slotEnd > busyEvent.start
      );
    }

    // Helper function to format date with timezone offset
    function formatRFC3339WithOffset(d: Date): string {
      const pad = (n: number) => String(n).padStart(2, '0');
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());

      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? '+' : '-';
      const abs = Math.abs(off);
      const oh = pad(Math.floor(abs / 60));
      const om = pad(abs % 60);

      return `${y}-${m}-${day}T${hh}:${mm}:${ss}${sign}${oh}:${om}`;
    }

    // Generate slots
    const slots: { start: string; end: string }[] = [];
    const now = new Date();
    const isToday = new Date().toDateString() === selectedDate.toDateString();

    console.log(`[slots] Processing ${windows.length} windows`);
    
    for (const window of windows) {
      console.log(`[slots] Processing window: ${window.start.toLocaleTimeString('he-IL')} - ${window.end.toLocaleTimeString('he-IL')}`);
      
      // Determine the earliest time we can start
      let earliestStart = window.start;
      
      if (isToday) {
        // If it's today, don't offer slots in the past
        const currentTime = new Date();
        if (currentTime > earliestStart) {
          earliestStart = currentTime;
        }
      }

      // Start generating slots from the earliest time
      let currentTime = new Date(earliestStart);
      
      // Align to duration boundaries
      const minutes = currentTime.getMinutes();
      const mod = minutes % durationMin;
      if (mod !== 0) {
        currentTime.setMinutes(minutes + (durationMin - mod), 0, 0);
      } else {
        currentTime.setSeconds(0, 0);
      }

      console.log(`[slots] Starting from: ${currentTime.toLocaleTimeString('he-IL')}`);

      // Generate slots until we exceed the window
      while (true) {
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(currentTime.getTime() + durationMin * 60 * 1000);

        // Check if this slot fits in the window
        if (slotEnd > window.end) {
          console.log(`[slots] Slot ${slotStart.toLocaleTimeString('he-IL')}-${slotEnd.toLocaleTimeString('he-IL')} exceeds window, stopping`);
          break;
        }

        // Check if this slot overlaps with busy times
        const slotStartWithBuffer = new Date(slotStart.getTime() - bufferMin * 60 * 1000);
        const slotEndWithBuffer = new Date(slotEnd.getTime() + bufferMin * 60 * 1000);
        
        if (!overlapsBusy(slotStartWithBuffer, slotEndWithBuffer)) {
          slots.push({
            start: formatRFC3339WithOffset(slotStart),
            end: formatRFC3339WithOffset(slotEnd)
          });
          console.log(`[slots] Added slot: ${slotStart.toLocaleTimeString('he-IL')} - ${slotEnd.toLocaleTimeString('he-IL')}`);
        } else {
          console.log(`[slots] Skipped slot: ${slotStart.toLocaleTimeString('he-IL')} - ${slotEnd.toLocaleTimeString('he-IL')} (overlaps busy)`);
        }

        // Move to next slot
        currentTime = new Date(currentTime.getTime() + durationMin * 60 * 1000);
      }
    }

    console.log('[slots] Total slots generated:', slots.length);
    if (slots.length > 0) {
      console.log('[slots] First slot:', slots[0]);
      console.log('[slots] Last slot:', slots[slots.length - 1]);
    }
    console.log('[slots] === END GET AVAILABLE SLOTS ===');
    
    return slots;
  } catch (error: any) {
    console.error('[slots] Error getting available slots:', error);
    
    if (error.code === 403 && error.message?.includes('Google Calendar API has not been used')) {
      throw new Error('Google Calendar API לא מופעל. אנא הפעל את ה-API ב-Google Cloud Console');
    }
    
    if (error.code === 401) {
      throw new Error('החיבור לגוגל פג תוקף. אנא התחבר מחדש');
    }
    
    throw new Error('שגיאה בטעינת זמנים פנויים: ' + (error.message || 'שגיאה לא ידועה'));
  }
}

export async function createBooking(
  email: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  start: string,
  end: string,
  notes: string,
  serviceConfig?: ServiceConfig
): Promise<any> {
  const tokens = getTrainerTokens(email);
  if (!tokens) {
    throw new Error('Trainer not authenticated');
  }

  oauth2Client.setCredentials(tokens);

  const calendarId = process.env.TRAINER_CALENDAR_ID || 'primary';
  const startTime = new Date(start);
  const endTime = new Date(end);

  try {
    // Create Google Meet link
    const meetLink = `https://meet.google.com/${generateMeetCode()}`;

            const event = {
          summary: `${clientName} - ${serviceConfig?.label || 'אימון אישי'}`,
          description: `
            לקוח: ${clientName}
            אימייל: ${clientEmail}
            טלפון: ${clientPhone}
            הערות: ${notes}
            
            קישור Google Meet: ${meetLink}
          `,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: process.env.SITE_TIMEZONE || 'Asia/Jerusalem',
      },
      attendees: [
        { email: clientEmail },
        { email: email } // Trainer's email
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

            return {
          eventId: response.data.id,
          htmlLink: response.data.htmlLink,
          meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || meetLink,
          startTime: response.data.start?.dateTime,
          endTime: response.data.end?.dateTime
        };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
}

function generateMeetCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
