import React from 'react';
import { MenuCard } from './MenuCard.jsx';
import { Utensils, Search } from 'lucide-react';

export const MenuGrid = ({ items = [], onOpenDetail, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-80 bg-slate-200/70 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3 max-w-lg mx-auto p-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Search className="w-8 h-8" />
        </div>
        <h4 className="font-heading font-extrabold text-lg text-slate-800">
          No encontramos platillos en esta categoría
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Intenta cambiar de sucursal, seleccionar otra categoría del menú o realizar una búsqueda con diferentes términos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, idx) => {
        const itemId = item._id || item.id || idx;
        return <MenuCard key={itemId} item={item} onOpenDetail={onOpenDetail} />;
      })}
    </div>
  );
};
