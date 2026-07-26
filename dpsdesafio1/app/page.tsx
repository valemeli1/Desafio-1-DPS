'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import products from '@/data/products.json';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { getuser } from '@/lib/auth';
import { product } from '@/types';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sCat, setselCat] = useState('all');

  // Antes de mostrar la tienda, revisamos si hay un usuario logueado.
  // Si no hay nadie logueado, mandamos directo al login.
  useEffect(() => {
    const user = getuser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  const cat = ['all', ...Array.from(new Set(products.map(p => p.category)))];

 const filterp = sCat === 'all' 
  ? (products as unknown as product[]) 
  : (products as unknown as product[]).filter(p => p.category === sCat);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#c71585] font-semibold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen">
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
    </div>
  );
}