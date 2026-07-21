import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

const CART_STORE_VERSION = 1;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      subtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'shop-cart',
      version: CART_STORE_VERSION,
      partialize: (state) => ({ items: state.items }),
      migrate: (persisted, version) => {
        if (version < CART_STORE_VERSION) {
          // Clear incompatible cart data from older versions
          return { items: [] };
        }
        return persisted as { items: CartItem[] };
      },
    }
  )
);
