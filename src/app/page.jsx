import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';

export const metadata = {
    title: 'Home'
};

export default function Page() {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME || 'auth_token')?.value;
    const payload = cookie ? verifyJwt(cookie) : null;

    // If user is authenticated, send them to the dashboard
    if (payload && payload.userId) {
        redirect('/apps/dashboards/dashboard');
    }

    // Otherwise, send to the sign-in page
    redirect('/auth-1/sign-in');
}
