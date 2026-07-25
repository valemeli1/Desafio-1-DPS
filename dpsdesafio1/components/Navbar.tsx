'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usestore } from '@/store/cartstore';
import { subscribeAuth, getAuthSnapshot, getAuthServerSnapshot, logoutuser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
    const cart = usestore((state) => state.cart);
    const count = cart.reduce((acc, item) => acc + item.quant, 0);

    const rawAuth = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
    const authUser: { username: string; email: string } | null = rawAuth ? JSON.parse(rawAuth) : null;
    const router = useRouter();

    const handleLogout = () => {
        logoutuser();
        toast.info('Sesión cerrada');
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-10 bg-[#fff0f5]/90 backdrop-blur-md border-b border-[#ffd1dc] shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-tight text-[#c71585] hover:opacity-90 transition">
                    Stray Kids & Co.
                </Link>

                <div className="flex items-center gap-3 text-sm">
                    <Link href="/cart" className="relative bg-[#ffb6c1] text-[#4a3b4c] px-4 py-2 rounded-2xl font-semibold shadow-sm hover:bg-[#ff91a4] transition-all">
                        Carrito
                        {count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#c71585] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                                {count}
                            </span>
                        )}
                    </Link>

                    {authUser ? (
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline text-[#8b5a6b] font-medium">Hola, {authUser.username}</span>
                            <button 
                                onClick={handleLogout} 
                                className="bg-[#ffe4e1] text-[#c71585] px-3.5 py-2 rounded-2xl font-semibold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/login" 
                            className="bg-[#ffe4e1] text-[#c71585] px-4 py-2 rounded-2xl font-semibold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition"
                        >
                            Ingresar
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}