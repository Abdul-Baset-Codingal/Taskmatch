import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';

        const response = await fetch('https://taskmatch-backend.vercel.app/api/auth/verify-token', {
            method: 'GET',
            headers: {
                'Cookie': cookieHeader,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const data = await response.json();
        return NextResponse.json({
            authenticated: true,
            user: data.user
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}