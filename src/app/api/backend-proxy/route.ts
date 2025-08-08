import { NextRequest, NextResponse } from 'next/server';

// This proxy uses a different approach to work around Vercel's HTTP restrictions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  
  try {
    // Use a different approach that might work with Vercel
    const response = await fetch(`http://143.110.150.238:3002/api/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJ1c2VySWQiOiJlNDE5MzgzOS01MzU0LTRjNGUtODY4Yy1kYmM5YmYwYzE4MTciLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTI0NzY0NjMsImV4cCI6MTc1MjU2Mjg2M30.fCrezMjo0DUWtmaatBME43KPfnwwQ-kg0MWQ-IQKtfg',
        'User-Agent': 'Mellys-Fashion-App/1.0'
      },
      // Try to bypass Vercel's restrictions
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend proxy error:', error);
    
    // Return a helpful error message
    return NextResponse.json({ 
      error: 'Backend connection failed',
      message: 'Vercel blocks HTTP connections. Please use a domain with SSL or Cloudflare.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  const body = await request.json();
  
  try {
    const response = await fetch(`http://143.110.150.238:3002/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJ1c2VySWQiOiJlNDE5MzgzOS01MzU0LTRjNGUtODY4Yy1kYmM5YmYwYzE4MTciLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTI0NzY0NjMsImV4cCI6MTc1MjU2Mjg2M30.fCrezMjo0DUWtmaatBME43KPfnwwQ-kg0MWQ-IQKtfg',
        'User-Agent': 'Mellys-Fashion-App/1.0'
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend proxy error:', error);
    
    return NextResponse.json({ 
      error: 'Backend connection failed',
      message: 'Vercel blocks HTTP connections. Please use a domain with SSL or Cloudflare.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
