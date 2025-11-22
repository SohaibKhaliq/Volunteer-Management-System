export async function apiRegister({ name, email, password }) {
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
    return res.json();
}

export async function apiLogin({ email, password, remember }) {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, remember }) });
    return res.json();
}

export async function apiLogout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.json();
}

export async function apiMe() {
    const res = await fetch('/api/auth/me');
    return res.json();
}
