import React from 'react';
import { formatCurrency } from '../../../shared/utils/formatters.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const CartSummary = ({ items, onCheckout, isLoading = false, showButton = true }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const tax = subtotal * 0.16; // 16% IVA aproximado o incluido
  const total = subtotal; // O subtotal + tax si los precios son sin IVA

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
        <ShoppingBag className="w-4 h-4 text-emerald-500" /> Resumen de Cuenta
      </h4>

      <div className="space-y-2 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA estimado (incluido):</span>
          <span className="font-medium text-slate-500">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
        <span className="font-heading font-extrabold text-base text-slate-800">Total a Pagar:</span>
        <span className="font-heading font-extrabold text-lg text-emerald-600">
          {formatCurrency(total)}
        </span>
      </div>

      {showButton && (
        <Button
          variant="emerald"
          size="lg"
          className="w-full mt-2 font-bold shadow-md shadow-emerald-500/20"
          onClick={onCheckout}
          disabled={items.length === 0}
          isLoading={isLoading}
        >
          <span>Proceder al Pedido</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
