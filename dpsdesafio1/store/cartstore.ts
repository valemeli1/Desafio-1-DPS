import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {cartitem, product, invoice} from '@/types';
import { get } from 'http';

interface state {
    cart: cartitem[];
    invoices: invoice[];
    add: (Product: product) => void;
    rcart: (id: string) => void;
    ucart: (id: string, quant: number) => void;
    clear: () => void;
    saveinvo: (inv: invoice) => void;


}

export const usestore = create<state>()(
    persist(
        (set, get) => ({

            cart: [],
            invoices: [],
            add: (Product) => {
                const ccart= get().cart;
                const aitem = ccart.find(item => item.id === Product.id);

                if (aitem) {
                    set({ cart: ccart.map(item => item.id === Product.id ? {...item, quant: item.quant +1} : item)});
                } else {
                    set({ cart: [...ccart, {...Product, quant:1}]});
                }
            },
            rcart: (id) => set({ cart: get().cart.filter(item => item.id !==id)}),
            ucart: (id, quant) => set({
                cart: get().cart.map(item => item.id === id ? {...item, quant: Math.max(1, quant)}: item)
            }),
            clear: () => set({ cart: []}),
            saveinvo: (inv) => set({ invoices: [...get().invoices, inv]}),
        }),
        {name: 'storage'}
    )
);