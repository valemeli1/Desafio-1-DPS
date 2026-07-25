import { user } from '@/types';

const USERS_KEY = 'skz-users';
const AUTH_KEY = 'skz-auth';

export function getusers(): user[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveusers(users: user[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registeruser(newUser: user): { ok: boolean; message: string } {
    const users = getusers();
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return { ok: false, message: 'Ese nombre de usuario ya existe' };
    }
    users.push(newUser);
    saveusers(users);
    return { ok: true, message: 'Cuenta creada correctamente' };
}

export function loginUser(username: string, password: string): { ok: boolean; message: string } {
    const users = getusers();
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!found) {
        return { ok: false, message: 'Usuario o contraseña incorrectos' };
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username: found.username, email: found.email }));
    notifyAuth();
    return { ok: true, message: `Bienvenido/a, ${found.username}` };
}

export function logoutuser() {
    localStorage.removeItem(AUTH_KEY);
    notifyAuth();
}

export function getuser(): { username: string; email: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}


const listeners = new Set<() => void>();

export function subscribeAuth(callback: () => void): () => void {
    listeners.add(callback);
    window.addEventListener('storage', callback);
    return () => {
        listeners.delete(callback);
        window.removeEventListener('storage', callback);
    };
}

function notifyAuth() {
    listeners.forEach((l) => l());
}

export function getAuthSnapshot(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_KEY);
}

export function getAuthServerSnapshot(): string | null {
    return null;
}

export function ensureDemoUser() {
    if (typeof window === 'undefined') return;
    const users = getusers();
    if (users.length === 0) {
        saveusers([{ username: 'valemeli', password: '123', email: 'valemeli@demo.com' }]);
    }
}