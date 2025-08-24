import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google';
import { SERVICES } from '@/config/services';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || '2025-08-30';
  const service = searchParams.get('service') || 'session60';
  const trainerEmail = searchParams.get('trainerEmail') || process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';

  console.log('=== TEST AVAILABILITY API ===');
  console.log('Date:', date);
  console.log('Service:', service);
  console.log('Trainer Email:', trainerEmail);

  const serviceConfig = SERVICES.find(s => s.id === service);
  if (!serviceConfig) {
    return NextResponse.json({ error: 'Service not found' }, { status: 400 });
  }

  try {
    console.log('Calling getAvailableSlots...');
    const slots = await getAvailableSlots(trainerEmail, date, serviceConfig);
    console.log('Slots returned:', slots.length);
    
    return NextResponse.json({ 
      success: true,
      slots: slots,
      debug: {
        date,
        service,
        trainerEmail,
        slotsCount: slots.length
      }
    });
  } catch (error: any) {
    console.error('Error in test availability:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת זמנים פנויים' },
      { status: 500 }
    );
  }
}
