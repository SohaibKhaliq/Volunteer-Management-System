export const runtime = 'nodejs';

import { getPrisma } from '@/lib/prisma';
import { comparePassword, signJwt, createTokenCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/schemas/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', issues: parsed.error.format() }, { status: 422 });
        }

        const { email, password, remember } = parsed.data;
        const normalizedEmail = email.toLowerCase();

        const prisma = await getPrisma();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
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
