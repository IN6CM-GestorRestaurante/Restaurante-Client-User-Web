import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ value = 0, onChange, size = 'md', readOnly = false }) => {
  const dims = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${star} estrellas`}
        >
          <Star
            className={`${dims} transition-colors ${
              star <= value ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
