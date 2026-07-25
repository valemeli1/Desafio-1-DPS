'use client';
import { useState } from "react";
import Link from "next/link";
import products from '@/data/products.json';
import ProductCard from '@/components/ProductCard';
import { product } from '@/types';

export default function Home() {
  const [sCat, setselCat] = useState('all');
  const cat = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filterp = sCat === 'all' 
    ? (products as product[]) 
    : (products as product[]).filter(p => p.category === sCat);

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#c71585]">Stray Kids & Co.</h1>
        <div className="flex gap-3">
          <Link href="/cart" className="bg-[#ffb6c1] text-[#4a3b4c] px-4 py-2 rounded-2xl font-semibold shadow-sm hover:bg-[#ff91a4] transition-all text-sm">
            Carrito
          </Link> 

          <Link href="/login" className="bg-[#ffe4e1] text-[#c71585] px-4 py-2 rounded-2xl font-semibold hover:bg-[#ffb6c1] hover:text-[#4a3b4c] transition-all text-sm">
            Ingresar
          </Link> 
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cat.map(c => (
          <button 
            key={c} 
            onClick={() => setselCat(c)} 
            className={`px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-all ${
              sCat === c 
                ? 'bg-[#ffb6c1] text-[#4a3b4c] border-[#ffb6c1] shadow-sm' 
                : 'bg-[#fff0f5] text-[#8b5a6b] border-[#ffd1dc] hover:border-[#ffb6c1]'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterp.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </main>
  );
}