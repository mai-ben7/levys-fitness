import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google';
import { SERVICES } from '@/config/services';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || '2025-08-30';
  const service = searchParams.get('service') || 'session60';
  const trainerEmail = searchParams.get('trainerEmail') || process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';

  console.log('=== FORCE REFRESH DEBUG ===');
  console.log('Testing new availability logic...');

  const serviceConfig = SERVICES.find(s => s.id === service);
  if (!serviceConfig) {
    return NextResponse.json({ error: 'Service not found' }, { status: 400 });
  }

  try {
    console.log('Calling getAvailableSlots with new logic...');
    const slots = await getAvailableSlots(trainerEmail, date, serviceConfig);
    console.log('Final slots count:', slots.length);
    
    // Show all slots with times
    const slotsWithTimes = slots.map(slot => ({
      start: new Date(slot.start).toLocaleTimeString('he-IL'),
      end: new Date(slot.end).toLocaleTimeString('he-IL'),
      startISO: slot.start,
      endISO: slot.end
    }));
    
    console.log('All slots with times:', slotsWithTimes);
    
    return NextResponse.json({ 
      success: true,
      slotsCount: slots.length,
      slotsWithTimes: slotsWithTimes,
      message: 'New logic executed successfully'
    });
  } catch (error: any) {
    console.error('Error in force refresh:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת זמנים פנויים' },
      { status: 500 }
    );
  }
}
