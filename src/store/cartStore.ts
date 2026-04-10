import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'pack' | 'photo' | 'content';
  title: string;
  price: number;
  thumbnail?: string;
  licenseType: 'personal' | 'commercial';
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, type: CartItem['type'], licenseType?: CartItem['licenseType']) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        // Avoid duplicates: same item + same license type
        if (!items.find((i) => i.id === item.id && i.type === item.type && i.licenseType === item.licenseType)) {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id, type, licenseType) =>
        set({
          items: get().items.filter((i) => !(i.id === id && i.type === type && (licenseType ? i.licenseType === licenseType : true))),
        }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
