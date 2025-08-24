import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google';
import { SERVICES } from '@/config/services';

export async function GET(request: NextRequest) {
  console.log('[slots] impl=2.2 route wired to google.ts getAvailableSlots');
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const service = searchParams.get('service');
  const trainerEmail = searchParams.get('trainerEmail') || process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  if (!service) {
    return NextResponse.json(
      { error: 'Service parameter is required' },
      { status: 400 }
    );
  }

  // Find the service configuration
  const serviceConfig = SERVICES.find(s => s.id === service);
  if (!serviceConfig) {
    return NextResponse.json(
      { error: 'Invalid service' },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(trainerEmail, date, serviceConfig);
    
    // Format slots for display
    const formattedSlots = slots.map(slot => ({
      start: slot.start,
      end: slot.end
    }));

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error('Error getting available slots:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת זמנים פנויים' },
      { status: 500 }
    );
  }
}
