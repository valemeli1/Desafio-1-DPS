'use client';
import { useState } from 'react';
import { usestore } from '@/store/cartstore';
import Link from 'next/link';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import InvoiceModal from '@/components/InvoiceModal';
import PaymentModal from '@/components/PaymentModal';
import { getuser } from '@/lib/auth';
import { invoiceid, nowiso } from '@/lib/invoice';
import { invoice } from '@/types';

export default function CartPage() {
    const { cart, ucart, rcart, clear, saveinvo } = usestore();
    const [activeInvoice, setActiveInvoice] = useState<invoice | null>(null);
    const [showPayment, setpayment] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quant, 0);

    const handleStartCheckout = () => {
        if (cart.length === 0) {
            toast.error('Tu carrito está vacío');
            return;
        }
        setpayment(true);
    };

    const handlePaid = () => {
        const user = getuser();
        const newInvoice: invoice = {
            id: invoiceid(),
            date: nowiso(),
            items: cart,
            total,
            email: user?.email ?? '',
        };

        saveinvo(newInvoice);
        setpayment(false);
        setActiveInvoice(newInvoice);
        clear();
    };

    return (
        <div className="min-h-screen bg-[#fff5f8]">
            <Navbar />
            <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#c71585]">Carrito de compras</h1>
                    <Link href="/" className="text-[#c71585] hover:underline text-sm font-medium">← Seguir comprando</Link>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-[#fff0f5] border border-[#ffd1dc] rounded-3xl p-8 text-center text-[#8b5a6b] shadow-sm">
                        Tu carrito está vacío.
                    </div>
                ) : (
                    <div className="bg-[#fff0f5] rounded-3xl shadow-sm border border-[#ffd1dc] p-4 sm:p-6 text-black">
                        {cart.map(item => (
                            <div key={item.id} className="flex flex-wrap justify-between items-center border-b border-[#ffe4e1] py-4 gap-2">
                                <div className="w-full sm:w-2/5">
                                    <h3 className="font-semibold text-base text-[#4a3b4c]">{item.name}</h3>
                                    <p className="text-sm text-[#8b5a6b]">${item.price.toFixed(2)} c/u</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => ucart(item.id, item.quant - 1)}
                                        className="bg-[#ffe4e1] text-[#c71585] w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition"
                                    >-</button>
                                    <span className="font-semibold text-[#4a3b4c]">{item.quant}</span>
                                    <button
                                        onClick={() => ucart(item.id, item.quant + 1)}
                                        className="bg-[#ffe4e1] text-[#c71585] w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition"
                                    >+</button>
                                </div>

                                <div className="flex items-center gap-4 justify-end">
                                    <span className="font-bold text-[#db7093]">${(item.price * item.quant).toFixed(2)}</span>
                                    <button
                                        onClick={() => {
                                            rcart(item.id);
                                            toast.info('Producto eliminado del carrito');
                                        }}
                                        className="text-[#d87093] hover:text-[#c71585] text-sm font-medium transition"
                                    >Eliminar</button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#ffe4e1]">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#4a3b4c]">Total: <span className="text-[#c71585]">${total.toFixed(2)}</span></h2>
                            <button
                                onClick={handleStartCheckout}
                                className="w-full sm:w-auto bg-[#ffb6c1] text-[#4a3b4c] px-6 py-3 rounded-2xl font-semibold shadow-md shadow-[#ffc0cb]/50 hover:bg-[#ff91a4] active:scale-95 transition-all"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showPayment && (
                <PaymentModal
                    total={total}
                    onClose={() => setpayment(false)}
                    onPaid={handlePaid}
                />
            )}

            {activeInvoice && (
                <InvoiceModal
                    inv={activeInvoice}
                    defaultEmail={activeInvoice.email}
                    onClose={() => setActiveInvoice(null)}
                />
            )}
        </div>
    );
}