import prisma from '@/lib/prisma';
import { comparePassword, signJwt, createTokenCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, remember } = body;
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const ok = await comparePassword(password, user.password);
        if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const token = signJwt({ userId: user.id, role: user.role, email: user.email, name: user.name }, { expiresIn: remember ? '30d' : '7d' });
        const cookie = createTokenCookie(token, { maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 });

        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 200, headers: { 'Set-Cookie': cookie } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
