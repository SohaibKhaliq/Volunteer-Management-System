import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyJwt } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET(request) {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 200 });

    const prisma = await getPrisma();
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 200 });
}
