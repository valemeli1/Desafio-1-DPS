'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PaymentModal({
    total,
    onClose,
    onPaid,
}: {
    total: number;
    onClose: () => void;
    onPaid: () => void;
}) {
    const [metodo, setMetodo] = useState<'tarjeta' | 'efectivo'>('tarjeta');
    const [numTarjeta, setNumTarjeta] = useState('');
    const [venc, setVenc] = useState('');
    const [cvv, setCvv] = useState('');
    const [nombreTitular, setNombreTitular] = useState('');
    const [procesando, setProcesando] = useState(false);

    const validarTarjeta = () => {
        const limpio = numTarjeta.replace(/\s/g, '');
        if (!nombreTitular.trim()) {
            toast.error('Ingresa el nombre del titular');
            return false;
        }
        if (!/^\d{16}$/.test(limpio)) {
            toast.error('El número de tarjeta debe tener 16 dígitos');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(venc)) {
            toast.error('Vencimiento inválido, usa formato MM/AA');
            return false;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            toast.error('CVV inválido');
            return false;
        }
        return true;
    };

    const handlePagar = () => {
        if (metodo === 'tarjeta' && !validarTarjeta()) return;

        setProcesando(true);
        setTimeout(() => {
            setProcesando(false);
            toast.success('Pago aprobado');
            onPaid();
        }, 1200);
    };

    const formatearTarjeta = (val: string) => {
        const limpio = val.replace(/\D/g, '').slice(0, 16);
        return limpio.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatearVenc = (val: string) => {
        const limpio = val.replace(/\D/g, '').slice(0, 4);
        if (limpio.length <= 2) return limpio;
        return `${limpio.slice(0, 2)}/${limpio.slice(2)}`;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 p-4">
            <div className="bg-[#fff0f5] rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#ffd1dc] text-[#4a3b4c]">
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#c71585]">Pagar pedido</h2>
                            <p className="text-sm text-[#8b5a6b] mt-1">Total a pagar: <span className="font-bold text-[#4a3b4c]">${total.toFixed(2)}</span></p>
                        </div>
                        <button onClick={onClose} className="text-[#8b5a6b] hover:text-[#c71585] text-xl font-bold leading-none bg-[#ffe4e1] w-8 h-8 rounded-full flex items-center justify-center transition">✕</button>
                    </div>

                    <div className="flex mb-6 rounded-full overflow-hidden border border-[#ffb6c1] bg-[#ffe4e1] p-0.5">
                        <button
                            onClick={() => setMetodo('tarjeta')}
                            className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all ${metodo === 'tarjeta' ? 'bg-[#ffb6c1] text-[#4a3b4c] shadow-sm' : 'text-[#8b5a6b] hover:text-[#4a3b4c]'}`}
                        >
                            Tarjeta
                        </button>
                        <button
                            onClick={() => setMetodo('efectivo')}
                            className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all ${metodo === 'efectivo' ? 'bg-[#ffb6c1] text-[#4a3b4c] shadow-sm' : 'text-[#8b5a6b] hover:text-[#4a3b4c]'}`}
                        >
                            Efectivo
                        </button>
                    </div>

                    {metodo === 'tarjeta' ? (
                        <div className="flex flex-col gap-3.5">
                            <input
                                type="text"
                                placeholder="Nombre del titular"
                                value={nombreTitular}
                                onChange={(e) => setNombreTitular(e.target.value)}
                                className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 rounded-xl text-sm text-black placeholder-gray-400 shadow-sm"
                            />
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={numTarjeta}
                                onChange={(e) => setNumTarjeta(formatearTarjeta(e.target.value))}
                                className="w-full bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 rounded-xl text-sm text-black placeholder-gray-400 shadow-sm tracking-wider"
                            />
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="MM/AA"
                                    value={venc}
                                    onChange={(e) => setVenc(formatearVenc(e.target.value))}
                                    className="w-1/2 bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 rounded-xl text-sm text-black placeholder-gray-400 shadow-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="w-1/2 bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none p-3 rounded-xl text-sm text-black placeholder-gray-400 shadow-sm"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[#8b5a6b] bg-[#ffe4e1]/60 border border-[#ffd1dc] rounded-2xl p-4 font-medium">
                            Pagarás en efectivo al momento de recibir tu pedido.
                        </p>
                    )}

                    <button
                        onClick={handlePagar}
                        disabled={procesando}
                        className="mt-6 w-full bg-[#ffb6c1] text-[#4a3b4c] py-3.5 rounded-2xl font-semibold shadow-md shadow-[#ffc0cb]/50 hover:bg-[#ff91a4] active:scale-95 transition-all disabled:opacity-60"
                    >
                        {procesando ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
                    </button>

                    <button
                        onClick={onClose}
                        className="mt-3 w-full text-[#8b5a6b] py-2.5 rounded-2xl hover:bg-[#ffe4e1]/50 text-sm font-medium transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}