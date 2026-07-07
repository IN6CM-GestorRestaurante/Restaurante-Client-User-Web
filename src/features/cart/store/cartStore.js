import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'DINE_IN', // 'DINE_IN' (Mesa) o 'TAKEAWAY' (Para llevar)
      tableNumber: '',
      notes: '',

      setOrderType: (type) => set({ orderType: type }),
      setTableNumber: (num) => set({ tableNumber: num }),
      setGeneralNotes: (notes) => set({ notes }),

      addItem: (menuItem, quantity = 1, modifiers = [], notes = '') => {
        set((state) => {
          const price = menuItem.price || 0;
          const itemId = menuItem._id || menuItem.id;

          // Verificar si ya existe el mismo ítem con idénticos modificadores y notas
          const existingIndex = state.items.findIndex(
            (item) =>
              (item.menuItem._id || item.menuItem.id) === itemId &&
              JSON.stringify(item.modifiers) === JSON.stringify(modifiers) &&
              item.notes === notes
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          } else {
            return {
              items: [
                ...state.items,
                {
                  menuItem,
                  quantity,
                  modifiers,
                  notes,
                  price,
                },
              ],
            };
          }
        });
      },

      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }));
      },

      updateQuantity: (index, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((_, i) => i !== index),
            };
          }
          const newItems = [...state.items];
          newItems[index].quantity = quantity;
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [], tableNumber: '', notes: '' });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.price || 0) * (item.quantity || 1);
        }, 0);
      },
      
      getTotalCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'restaurant-user-cart-storage',
    }
  )
);
