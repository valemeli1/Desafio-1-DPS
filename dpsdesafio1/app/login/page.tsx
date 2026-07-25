'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { loginUser, registeruser, ensureDemoUser } from "@/lib/auth";

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        ensureDemoUser();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const result = loginUser(username, password);
        if (result.ok) {
            toast.success(result.message);
            router.push('/');
        } else {
            toast.error(result.message);
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password || !email) {
            toast.error('Completa todos los campos');
            return;
        }
        const result = registeruser({ username, password, email });
        if (result.ok) {
            toast.success(result.message);
            setMode('login');
            setPassword('');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-[#fff5f8]">
            <div className="bg-[#fff0f5] p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-sm border border-[#ffd1dc]">
                <div className="flex mb-6 rounded-full overflow-hidden border border-[#ffb6c1] bg-[#ffe4e1] p-0.5">
                    <button
                        onClick={() => setMode('login')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all ${mode === 'login' ? 'bg-[#ffb6c1] text-[#4a3b4c] shadow-sm' : 'text-[#8b5a6b] hover:text-[#4a3b4c]'}`}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all ${mode === 'register' ? 'bg-[#ffb6c1] text-[#4a3b4c] shadow-sm' : 'text-[#8b5a6b] hover:text-[#4a3b4c]'}`}
                    >
                        Registrarse
                    </button>
                </div>

                {mode === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#c71585]">Iniciar sesión</h2>
                        <input type="text"
                            placeholder="usuario"
                            className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 mb-4 rounded-xl text-black placeholder-gray-400 text-sm shadow-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                        <input type="password"
                            placeholder="contraseña"
                            className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 mb-6 rounded-xl text-black placeholder-gray-400 text-sm shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="w-full bg-[#ffb6c1] text-[#4a3b4c] p-3 rounded-2xl font-semibold hover:bg-[#ff91a4] active:scale-95 transition-all shadow-md shadow-[#ffc0cb]/50">Entrar</button>
                        <p className="text-xs text-[#8b5a6b] mt-4 text-center">
                            Demo: usuario <b>valemeli</b> / contraseña <b>123</b>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#c71585]">Crear cuenta</h2>
                        <input type="text"
                            placeholder="usuario"
                            className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 mb-4 rounded-xl text-black placeholder-gray-400 text-sm shadow-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                        <input type="email"
                            placeholder="correo electrónico"
                            className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 mb-4 rounded-xl text-black placeholder-gray-400 text-sm shadow-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input type="password"
                            placeholder="contraseña"
                            className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 mb-6 rounded-xl text-black placeholder-gray-400 text-sm shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="w-full bg-[#ffb6c1] text-[#4a3b4c] p-3 rounded-2xl font-semibold hover:bg-[#ff91a4] active:scale-95 transition-all shadow-md shadow-[#ffc0cb]/50">Registrarme</button>
                    </form>
                )}

                <Link href="/" className="block text-center text-sm font-medium text-[#c71585] hover:underline mt-6">
                    ← Volver al catálogo
                </Link>
            </div>
        </div>
    );
}