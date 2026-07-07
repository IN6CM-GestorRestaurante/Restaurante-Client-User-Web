import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency, resolveImageUrl } from '../../../shared/utils/formatters.js';
import { useCartStore } from '../../cart/store/cartStore.js';
import { Plus, Minus, ShoppingBag, Clock, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const MenuItemDetailModal = ({ isOpen, onClose, item }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedModifiers([]);
      setNotes('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const name = item.name || item.nombre || 'Platillo Gourmet';
  const description = item.description || item.descripcion || '';
  const price = item.price || 0;
  const imageUrl = item.image || item.imagen || '';
  const preparationTime = item.preparationTime || item.tiempo || '15-20 min';
  const isSpecial = item.isSpecial || item.especial || false;

  // Modificadores opcionales o sugeridos (pueden venir del backend o ser una lista de opciones gastronómicas comunes)
  const availableModifiers = item.modifiers || [
    'Queso extra parmesano (+ gratis)',
    'Punto de cocción: Término medio',
    'Punto de cocción: Bien cocido',
    'Sin cebolla ni ajo',
    'Salsa picante artesanal aparte',
    'Aderezo extra',
  ];

  const handleToggleModifier = (mod) => {
    if (selectedModifiers.includes(mod)) {
      setSelectedModifiers(selectedModifiers.filter((m) => m !== mod));
    } else {
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  const handleAddToCart = () => {
    addItem(item, quantity, selectedModifiers, notes);
    toast.success(`¡${quantity}x ${name} agregado al carrito!`, {
      icon: '🍽️',
      style: {
        borderRadius: '12px',
        background: '#10B981',
        color: '#fff',
      },
    });
    onClose();
  };

  const totalPrice = price * quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={name} maxWidth="max-w-xl">
      <div className="space-y-5 animate-fadeIn -mt-2">
        
        {/* Imagen y Badges */}
        <div className="relative h-56 -mx-6 -mt-2 overflow-hidden bg-slate-100 rounded-b-2xl">
          <img
            src={resolveImageUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="font-extrabold text-2xl drop-shadow-md">{formatCurrency(price)}</span>
              <span className="text-xs text-slate-200 ml-2">/ porción</span>
            </div>
          </div>
          {isSpecial && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> Especial del Chef
            </span>
          )}
        </div>

        {/* Descripción y Tiempo */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
            <Clock className="w-4 h-4 text-emerald-500" /> Tiempo estimado de preparación: {preparationTime}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {description || 'Delicioso platillo elaborado con ingredientes frescos de temporada y la técnica secreta de cocina gourmet del restaurante.'}
          </p>
        </div>

        {/* Modificadores / Opciones de preparación */}
        {availableModifiers.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Opciones y Modificadores:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableModifiers.map((mod, idx) => {
                const checked = selectedModifiers.includes(mod);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleModifier(mod)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all select-none ${
                      checked
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="truncate pr-1">{mod}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        checked ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notas y comentarios para cocina */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Instrucciones Especiales para Cocina (Opcional):
          </label>
          <textarea
            rows="2"
            placeholder="Ej. Sin picante, aderezo aparte, bien caliente..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Selector de Cantidad y Botón de Acción */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-heading font-extrabold text-base text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="emerald"
            size="lg"
            className="flex-1 font-extrabold text-base shadow-lg shadow-emerald-500/25 justify-between px-6"
            onClick={handleAddToCart}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Agregar al Carrito
            </span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </div>

      </div>
    </Modal>
  );
};
