import { NextResponse } from 'next/server';
import { verifyJwt } from './src/lib/auth';
import { jwtPayloadSchema } from './src/lib/schemas/auth';

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // protect admin area (app has layouts under (admin) folder)
    if (pathname.startsWith('/(admin)') || pathname.startsWith('/admin')) {
        const cookie = req.cookies.get(process.env.AUTH_COOKIE_NAME || 'auth_token')?.value;
        if (!cookie) {
            const signInUrl = new URL('/auth-1/sign-in', req.url);
            return NextResponse.redirect(signInUrl);
        }

        const payload = verifyJwt(cookie);
        if (!payload) {
            const signInUrl = new URL('/auth-1/sign-in', req.url);
            return NextResponse.redirect(signInUrl);
        }

        const parsed = jwtPayloadSchema.safeParse(payload);
        if (!parsed.success || parsed.data.role !== 'ADMIN') {
            const signInUrl = new URL('/auth-1/sign-in', req.url);
            return NextResponse.redirect(signInUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};
