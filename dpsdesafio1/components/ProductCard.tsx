'use client';
import Image from "next/image";
import { product } from "@/types";
import { usestore } from '@/store/cartstore';
import { toast } from 'sonner';

export default function PrCard({ product }: { product: product }) {
    const add = usestore((state) => state.add);

    const handleadd = () => {
        add(product);
        toast.success(`${product.name} added to the cart`);
    };

    const imageSrc = product.img?.startsWith('http') || product.img?.startsWith('/') 
        ? product.img 
        : `/${product.img}`;

    return (
        <div className="group flex flex-row items-center bg-[#fff0f5] rounded-3xl border border-[#ffd1dc] shadow-sm hover:shadow-md hover:border-[#ffb6c1] transition-all duration-300 overflow-hidden p-3 sm:p-4 gap-4 w-full">
            {/* Contenedor de la Imagen a la izquierda */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-white/60">
                {product.img ? (
                    <Image 
                        src={imageSrc}
                        alt={product.name} 
                        fill
                        sizes="(max-width: 640px) 96px, 128px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[#d87093] font-medium">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Contenido de la tarjeta a la derecha */}
            <div className="flex flex-col justify-between flex-grow h-full py-1">
                <div className="space-y-1">
                    <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-wider text-[#c71585] uppercase bg-[#ffe4e1] px-2.5 py-0.5 rounded-full">
                        {product.category}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-lg text-[#4a3b4c] line-clamp-1 group-hover:text-[#c71585] transition-colors">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-base sm:text-lg text-[#db7093]">
                        ${product.price.toFixed(2)}
                    </span>
                    <button 
                        onClick={handleadd} 
                        className="bg-[#ffb6c1] text-[#4a3b4c] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#ff91a4] active:scale-95 transition-all shadow-sm shadow-[#ffc0cb]/50"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}