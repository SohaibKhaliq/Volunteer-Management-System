export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/auth';

export async function POST() {
    try {
        const cookie = clearTokenCookie();
        return NextResponse.json({ ok: true }, { status: 200, headers: { 'Set-Cookie': cookie } });
    } catch (err) {
        console.error('Logout error', err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
