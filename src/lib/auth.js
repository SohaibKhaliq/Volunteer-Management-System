import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'auth_token';

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export function signJwt(payload, options = {}) {
    const expiresIn = options.expiresIn || '7d';
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function createTokenCookie(token, opts = {}) {
    const maxAge = typeof opts.maxAge === 'number' ? opts.maxAge : 60 * 60 * 24 * 7; // 7 days
    const secure = process.env.NODE_ENV === 'production';
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge
    });
}

export function clearTokenCookie() {
    return serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    });
}

export function getTokenFromRequest(req) {
    // Works with Next.js app router Request
    try {
        const cookieHeader = req.headers.get('cookie') || '';
        const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith((process.env.AUTH_COOKIE_NAME || 'auth_token') + "="));
        if (!match) return null;
        return match.split('=')[1];
    } catch (err) {
        return null;
    }
}
