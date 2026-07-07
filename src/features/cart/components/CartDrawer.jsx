import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Utensils } from 'lucide-react';
import { useCartStore } from '../store/cartStore.js';
import { CartItem } from './CartItem.jsx';
import { CartSummary } from './CartSummary.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { items, clearCart, orderType, setOrderType } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProceedCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-[calc(100%-3rem)] sm:w-full max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideInRight border-l border-slate-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-800">
                  Tu Carrito Gourmet
                </h3>
                <p className="text-[11px] text-slate-500">
                  {items.length === 0 ? 'Sin platillos seleccionados' : `${items.length} platillo(s) en orden`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Vaciar carrito"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body / Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <Utensils className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-600 text-sm">El carrito está vacío</p>
                <p className="text-xs max-w-[200px]">
                  Explora nuestro catálogo gourmet y añade los platillos de tu preferencia.
                </p>
              </div>
            ) : (
              <>
                {/* Selector rápido de tipo de consumo */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Tipo de Consumo:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('DINE_IN')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                        orderType === 'DINE_IN'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      🍽️ En Restaurante
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('TAKEAWAY')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                        orderType === 'TAKEAWAY'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      🛍️ Para Llevar
                    </button>
                  </div>
                </div>

                {items.map((item, idx) => (
                  <CartItem key={idx} item={item} index={idx} />
                ))}
              </>
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <CartSummary
                items={items}
                onCheckout={handleProceedCheckout}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
