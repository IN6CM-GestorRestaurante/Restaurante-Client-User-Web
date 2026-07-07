import React from 'react';
import { Plus, Sparkles, Clock, Flame, Tag } from 'lucide-react';
import { formatCurrency, resolveImageUrl, getActivePromotion } from '../../../shared/utils/formatters.js';

export const MenuCard = ({ item, onOpenDetail }) => {
  const name = item.name || item.nombre || 'Platillo Gourmet';
  const description = item.description || item.descripcion || 'Una exquisita preparación artesanal con ingredientes selectos y especias del chef.';
  const price = item.price || 0;
  const imageUrl = item.image || item.imagen || '';
  const isAvailable = item.isAvailable !== false && item.disponible !== false;
  const isSpecial = item.isSpecial || item.especial || false;
  const preparationTime = item.preparationTime || item.tiempo || '15-20 min';
  const promotion = getActivePromotion(item);

  return (
    <div
      onClick={() => isAvailable && onOpenDetail(item)}
      className={`group relative rounded-2xl bg-white border border-slate-200/80 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isAvailable
          ? 'hover:shadow-lg hover:border-emerald-500/50 hover:-translate-y-1 cursor-pointer'
          : 'opacity-60 cursor-not-allowed bg-slate-50'
      }`}
    >
      {/* Imagen Superior con Aspect Ratio */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={resolveImageUrl(imageUrl)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Badges Flotantes */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isSpecial && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-md animate-pulse">
              <Sparkles className="w-3 h-3" /> Especial del Chef
            </span>
          )}
          {promotion && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white font-bold text-[11px] shadow-md">
              <Tag className="w-3 h-3" /> {promotion.label}
            </span>
          )}
          {!isAvailable && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] shadow-md">
              Agotado por hoy
            </span>
          )}
        </div>

        {/* Precio en Esquina Inferior Derecha de la imagen */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white shadow-md">
          {promotion ? (
            <>
              <span className="text-[11px] line-through text-slate-400">{formatCurrency(promotion.originalPrice)}</span>
              <span className="font-extrabold text-sm text-emerald-400">{formatCurrency(promotion.discountedPrice)}</span>
            </>
          ) : (
            <span className="font-extrabold text-sm">{formatCurrency(price)}</span>
          )}
        </div>
      </div>

      {/* Contenido / Texto */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-base text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-500" /> {preparationTime}
          </span>
          
          {isAvailable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(item);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
