import { create } from 'zustand';
import { Product } from '@/types';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface QuoteState {
  items: Product[];
  addItem: (data: Product, update?: Boolean) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useQuoteStore = create(
  persist<QuoteState>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, update: Boolean = false) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast('Item already added.');
        }

        set({ items: [...get().items, data] });
        if (!update) {
          toast.success('Item added to quote.');
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success('Item removed from quote.');
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'quote-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useQuoteStore;
