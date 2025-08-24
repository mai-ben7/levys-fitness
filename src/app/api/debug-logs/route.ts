import { NextResponse } from 'next/server';

export async function GET() {
  // This is just a placeholder - we'll check the actual server logs
  return NextResponse.json({
    message: 'Check the server console for detailed logs',
    timestamp: new Date().toISOString()
  });
}
