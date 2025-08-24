import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, storeTrainerTokens } from '@/lib/google';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // You can use this to store trainer email

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code not provided' },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokensFromCode(code);
    
    // For now, we'll use a default trainer email
    // In production, you'd get this from the state parameter or session
    const trainerEmail = process.env.TRAINER_EMAIL || 'training.program.levys@gmail.com';
    
    storeTrainerTokens(trainerEmail, tokens);

    return NextResponse.json({
      success: true,
      message: 'Trainer successfully connected to Google Calendar',
      trainerEmail
    });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Google' },
      { status: 500 }
    );
  }
}
