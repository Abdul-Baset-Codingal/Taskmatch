/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts (in root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected routes
    const taskerRoutes = ['/dashboard/tasker'];
    const clientRoutes = ['/dashboard/client'];
    const adminRoutes = ['/dashboard/admin'];

    const isTaskerRoute = taskerRoutes.some(route => path.startsWith(route));
    const isClientRoute = clientRoutes.some(route => path.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

    const isProtectedRoute = isTaskerRoute || isClientRoute || isAdminRoute;

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    try {
        // Verify token with your backend
        const response = await fetch('https://taskmatch-backend.vercel.app/api/auth/verify-token', {
            method: 'GET',
            headers: {
                
                Cookie: request.headers.get('cookie') || '',
            },
        });

        if (!response.ok) {
            // Not logged in - redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const data = await response.json();
        const userRole = data.user?.currentRole;

        // Check role-based access
        if (isTaskerRoute && userRole !== 'tasker') {
            return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
        }

        if (isClientRoute && userRole !== 'client') {
            return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
        }

        if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Error verifying - redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};