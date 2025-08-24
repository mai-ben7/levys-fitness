import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getTrainerTokens } from '@/lib/google';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || '2025-08-30';
  const trainerEmail = searchParams.get('trainerEmail') || process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';

  const tokens = getTrainerTokens(trainerEmail);
  if (!tokens) {
    return NextResponse.json({ error: 'Trainer not authenticated' }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('=== LISTING ALL EVENTS ===');
    console.log('Date:', date);
    console.log('Start of day:', startOfDay.toISOString());
    console.log('End of day:', endOfDay.toISOString());

    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    console.log('Total events found:', events.length);

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description,
      color: event.colorId,
      backgroundColor: event.backgroundColor
    }));

    return NextResponse.json({
      success: true,
      date,
      totalEvents: events.length,
      events: formattedEvents
    });

  } catch (error: any) {
    console.error('Error listing events:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת אירועים' },
      { status: 500 }
    );
  }
}
