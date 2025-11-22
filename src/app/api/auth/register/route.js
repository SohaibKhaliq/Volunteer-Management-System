import { getPrisma } from '@/lib/prisma';
import { hashPassword, signJwt, createTokenCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', issues: parsed.error.format() }, { status: 422 });
        }

        const { name, email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();

        const prisma = await getPrisma();
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const hashed = await hashPassword(password);
        const user = await prisma.user.create({ data: { name, email: normalizedEmail, password: hashed } });

        const token = signJwt({ userId: user.id, role: user.role, email: user.email, name: user.name });
        const cookie = createTokenCookie(token);

        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201, headers: { 'Set-Cookie': cookie } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
