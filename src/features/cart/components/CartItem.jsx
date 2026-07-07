import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency, resolveImageUrl } from '../../../shared/utils/formatters.js';
import { useCartStore } from '../store/cartStore.js';

export const CartItem = ({ item, index }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const menuItem = item.menuItem || {};
  const name = menuItem.name || menuItem.nombre || 'Platillo Gourmet';
  const price = item.price || menuItem.price || 0;
  const imageUrl = menuItem.image || menuItem.imagen || '';

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:bg-white hover:shadow-sm">
      <img
        src={resolveImageUrl(imageUrl)}
        alt={name}
        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80';
        }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">
            {name}
          </h5>
          <span className="font-bold text-xs text-emerald-600 shrink-0">
            {formatCurrency(price * item.quantity)}
          </span>
        </div>

        {/* Modificadores */}
        {item.modifiers && item.modifiers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.modifiers.map((mod, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">
                + {mod}
              </span>
            ))}
          </div>
        )}

        {/* Notas personalizadas */}
        {item.notes && (
          <p className="mt-1 text-[11px] italic text-slate-500 line-clamp-1">
            "{item.notes}"
          </p>
        )}

        {/* Controles de Cantidad y Borrar */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => updateQuantity(index, item.quantity - 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(index, item.quantity + 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(index)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
