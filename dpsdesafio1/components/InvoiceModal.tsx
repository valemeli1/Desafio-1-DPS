'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { invoice } from '@/types';

// Genera un PDF real de la factura en el navegador usando jsPDF (sin backend).
function generateInvoicePdf(inv: invoice) {
    // Importación dinámica: jsPDF solo se necesita en el cliente.
    return import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();

        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(199, 21, 133); // rosa pastel/fucsia acorde (#c71585)
        doc.text('Stray Kids & Co.', 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(139, 90, 107);
        doc.text(`Factura: ${inv.id}`, 14, 30);
        doc.text(`Fecha: ${new Date(inv.date).toLocaleString()}`, 14, 36);
        doc.text(`Cliente: ${inv.email || 'N/D'}`, 14, 42);

        // Encabezado de la tabla
        let y = 54;
        doc.setFontSize(10);
        doc.setTextColor(74, 59, 76);
        doc.text('Producto', 14, y);
        doc.text('Cant.', 130, y);
        doc.text('Subtotal', 160, y);
        y += 2;
        doc.line(14, y, 196, y);
        y += 8;

        // Filas de productos
        inv.items.forEach((item) => {
            doc.text(item.name, 14, y, { maxWidth: 110 });
            doc.text(String(item.quant), 130, y);
            doc.text(`$${(item.price * item.quant).toFixed(2)}`, 160, y);
            y += 8;
        });

        // Total
        y += 4;
        doc.line(14, y, 196, y);
        y += 8;
        doc.setFontSize(13);
        doc.setTextColor(199, 21, 133);
        doc.text(`Total: $${inv.total.toFixed(2)}`, 140, y);

        // Devolvemos el doc en vez de guardarlo aqui, asi afuera podemos
        // tanto descargarlo como sacarle el base64 para mandarlo por correo.
        return doc;
    });
}

export default function InvoiceModal({
    inv,
    defaultEmail,
    onClose,
}: {
    inv: invoice;
    defaultEmail: string;
    onClose: () => void;
}) {
    const [email, setEmail] = useState(defaultEmail);
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!email || !email.includes('@')) {
            toast.error('Ingresa un correo válido');
            return;
        }

        // 1) Generamos el PDF real con jsPDF.
        // 2) Lo descargamos en este dispositivo.
        // 3) Sacamos el PDF en base64 y lo mandamos a nuestra propia ruta
        //    /api/send-invoice, que usa Nodemailer para enviarlo de verdad.
        const process = generateInvoicePdf(inv).then(async (doc) => {
            doc.save(`${inv.id}.pdf`);

            const pdfBase64 = doc.output('datauristring').split(',')[1];

            const res = await fetch('/api/send-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    invoiceId: inv.id,
                    date: inv.date,
                    items: inv.items,
                    total: inv.total,
                    pdfBase64,
                }),
            });

            const data = await res.json();
            if (!data.ok) {
                throw new Error(data.message);
            }
        });

        toast.promise(process, {
            loading: `Generando factura PDF y enviando a ${email}...`,
            success: () => {
                setSent(true);
                return `Factura ${inv.id} enviada a ${email}`;
            },
            error: (err) => (err instanceof Error ? err.message : 'No se pudo enviar la factura'),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 p-4">
            <div className="bg-[#fff0f5] rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#ffd1dc] text-[#4a3b4c]">
                <div className="bg-[#ffb6c1] px-6 py-5 rounded-t-3xl text-[#4a3b4c] relative shadow-sm">
                    <h2 className="text-xl font-bold text-[#c71585]">Factura</h2>
                    <p className="text-sm font-semibold text-[#4a3b4c] mt-0.5">{inv.id}</p>
                    <p className="text-xs text-[#8b5a6b] mt-0.5">{new Date(inv.date).toLocaleString()}</p>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-5 text-[#8b5a6b] hover:text-[#4a3b4c] text-xl font-bold leading-none bg-[#ffe4e1] w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 sm:p-8 text-[#4a3b4c]">
                    <div className="border-t border-b border-[#ffd1dc] divide-y divide-[#ffe4e1]">
                        {inv.items.map((item) => (
                            <div key={item.id} className="flex justify-between py-2.5 text-sm">
                                <span className="font-medium">{item.name} × {item.quant}</span>
                                <span className="font-semibold text-[#8b5a6b]">${(item.price * item.quant).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between font-bold text-lg mt-5">
                        <span>Total</span>
                        <span className="text-[#c71585]">${inv.total.toFixed(2)}</span>
                    </div>

                    <div className="mt-6">
                        <label className="text-sm font-semibold text-[#8b5a6b] block mb-1">
                            Enviar factura por correo
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 mt-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="flex-1 bg-white/80 border border-[#ffd1dc] focus:border-[#ff69b4] outline-none rounded-xl p-3 text-sm text-black placeholder-gray-400 shadow-sm"
                                disabled={sent}
                            />
                            <button
                                onClick={handleSend}
                                disabled={sent}
                                className="bg-[#ffb6c1] text-[#4a3b4c] px-4 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-[#ff91a4] active:scale-95 disabled:opacity-60 whitespace-nowrap transition"
                            >
                                {sent ? 'Enviado ✓' : 'Enviar'}
                            </button>
                        </div>
                        <p className="text-xs text-[#8b5a6b] mt-2 leading-relaxed">
                            Se descargará un PDF de tu factura en este dispositivo y también se enviará una copia real a tu correo.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full bg-[#ffe4e1] text-[#c71585] py-3 rounded-2xl font-semibold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}