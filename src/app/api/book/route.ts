import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/google';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      note,
      start,
      end,
      service,
      trainerEmail = process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com'
    } = body;

    // Validate required fields
    if (!name || !email || !start || !end || !service) {
      return NextResponse.json(
        { error: 'כל השדות הנדרשים חייבים להיות מלאים' },
        { status: 400 }
      );
    }

    // Find service configuration
    const { SERVICES } = await import('@/config/services');
    const serviceConfig = SERVICES.find(s => s.id === service);
    if (!serviceConfig) {
      return NextResponse.json(
        { error: 'שירות לא תקין' },
        { status: 400 }
      );
    }

    const booking = await createBooking(
      trainerEmail,
      name,
      email,
      phone || '',
      start,
      end,
      note || '',
      serviceConfig
    );

    return NextResponse.json({
      ok: true,
      htmlLink: booking.htmlLink,
      meetLink: booking.meetLink,
      eventId: booking.eventId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'שגיאה בקביעת הפגישה' },
      { status: 500 }
    );
  }
}
