import React from 'react';
import { Utensils, Coffee, Pizza, IceCream, Wine, Flame, Sparkles } from 'lucide-react';

export const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('bebida') || lower.includes('drink')) return Wine;
    if (lower.includes('postre') || lower.includes('dessert') || lower.includes('dulce')) return IceCream;
    if (lower.includes('café') || lower.includes('coffee')) return Coffee;
    if (lower.includes('pizza') || lower.includes('pasta')) return Pizza;
    if (lower.includes('especial') || lower.includes('chef') || lower.includes('recomend')) return Sparkles;
    if (lower.includes('parrilla') || lower.includes('carne') || lower.includes('grill')) return Flame;
    return Utensils;
  };

  return (
    <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar selection:bg-none">
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none ${
          activeCategory === 'ALL'
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
        }`}
      >
        <Utensils className="w-4 h-4" />
        <span>Todos los Platillos</span>
      </button>

      {categories.map((cat, idx) => {
        const catId = cat._id || cat.id || cat.name || idx;
        const catName = cat.name || cat.nombre || 'Categoría';
        const Icon = getCategoryIcon(catName);
        const isActive = activeCategory === catId;

        return (
          <button
            key={catId}
            onClick={() => onSelectCategory(catId)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{catName}</span>
          </button>
        );
      })}
    </div>
  );
};
