import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'pack' | 'photo' | 'content';
  title: string;
  price: number;
  thumbnail?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, type: CartItem['type']) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        // Avoid duplicates if needed, or allow multiples
        if (!items.find((i) => i.id === item.id && i.type === item.type)) {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id, type) =>
        set({
          items: get().items.filter((i) => !(i.id === id && i.type === type)),
        }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
