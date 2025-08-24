import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  if (limit.count >= 5) { // Max 5 requests per 15 minutes
    return true;
  }
  
  limit.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message, website } = body;
    
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'יותר מדי בקשות. אנא נסה/נסי שוב מאוחר יותר' },
        { status: 429 }
      );
    }
    
    // Honeypot check
    if (website) {
      return NextResponse.json({ ok: true }); // Silently ignore spam
    }
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'שם ומספר טלפון הם שדות חובה' },
        { status: 400 }
      );
    }
    
    // Validate phone number (simple regex)
    if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      return NextResponse.json(
        { error: 'מספר טלפון לא תקין' },
        { status: 400 }
      );
    }
    
    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'אימייל לא תקין' },
        { status: 400 }
      );
    }
    
    // In production, you would:
    // 1. Store in database
    // 2. Send email notification
    // 3. Log the contact request
    
    console.log('Contact request received:', {
      name,
      phone,
      email,
      message,
      timestamp: new Date().toISOString(),
      ip
    });
    
    // For now, just return success
    // TODO: Implement actual storage and notification
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json(
      { error: 'שגיאה בעיבוד הבקשה' },
      { status: 500 }
    );
  }
}
