import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // Clear the http-only cookie
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Immediately expire
    });

    return response;
  } catch (error) {
    console.error('Error clearing cookie:', error);
    return NextResponse.json(
      { error: 'Failed to clear cookie' },
      { status: 500 }
    );
  }
}
