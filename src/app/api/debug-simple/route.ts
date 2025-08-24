import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google';
import { SERVICES } from '@/config/services';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || '2025-08-30';
  const service = searchParams.get('service') || 'session60';
  const trainerEmail = searchParams.get('trainerEmail') || process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';

  console.log('=== SIMPLE DEBUG ===');
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
    console.log('Final slots count:', slots.length);
    
    // Show first few slots
    const firstSlots = slots.slice(0, 5);
    console.log('First 5 slots:', firstSlots.map(slot => ({
      start: new Date(slot.start).toLocaleTimeString('he-IL'),
      end: new Date(slot.end).toLocaleTimeString('he-IL')
    })));
    
    return NextResponse.json({ 
      success: true,
      slotsCount: slots.length,
      firstSlots: firstSlots,
      allSlots: slots
    });
  } catch (error: any) {
    console.error('Error in simple debug:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת זמנים פנויים' },
      { status: 500 }
    );
  }
}
