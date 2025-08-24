import { NextResponse } from 'next/server';

export async function GET() {
  // This is a placeholder - we need to check the actual server console
  return NextResponse.json({
    message: 'Check the server console for logs',
    instructions: [
      '1. Open the terminal where npm run dev is running',
      '2. Look for logs starting with "=== AVAILABILITY DEBUG ==="',
      '3. Check what events are found and which ones are marked as availability'
    ]
  });
}
