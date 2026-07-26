import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { to, invoiceId, date, items, total, pdfBase64 } = body;

        if (!to || !pdfBase64) {
            return NextResponse.json(
                { ok: false, message: 'Faltan datos para enviar la factura' },
                { status: 400 }
            );
        }

        // Creamos el "transportador" de correo con nuestra cuenta de Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Armamos un listado simple de los productos para el cuerpo del correo
        type ItemFactura = { name: string; quant: number; price: number };
        const listaProductos = (items as ItemFactura[])
            .map((item) => `- ${item.name} x${item.quant} = $${(item.price * item.quant).toFixed(2)}`)
            .join('\n');

        await transporter.sendMail({
            from: `"Stray Kids & Co." <${process.env.EMAIL_USER}>`,
            to,
            subject: `Tu factura ${invoiceId}`,
            text: `Gracias por tu compra en Stray Kids & Co.\n\nFactura: ${invoiceId}\nFecha: ${new Date(date).toLocaleString()}\n\nProductos:\n${listaProductos}\n\nTotal: $${Number(total).toFixed(2)}\n\nAdjuntamos tu factura en PDF.`,
            attachments: [
                {
                    filename: `${invoiceId}.pdf`,
                    content: pdfBase64,
                    encoding: 'base64',
                },
            ],
        });

        return NextResponse.json({ ok: true, message: 'Factura enviada correctamente' });
    } catch (error) {
        console.error('Error enviando la factura:', error);
        return NextResponse.json(
            { ok: false, message: 'No se pudo enviar el correo, revisa tus credenciales en .env.local' },
            { status: 500 }
        );
    }
}
