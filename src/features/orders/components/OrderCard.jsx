import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Ban } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js';
import { OrderStatusBadge } from './OrderStatusBadge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';

export const OrderCard = ({ order, onCancelOrder }) => {
  const orderId = order._id || order.id || 'ORD-000';
  const displayId = orderId.slice(-6).toUpperCase();
  const date = order.createdAt || order.fecha || new Date().toISOString();
  const status = order.status || 'EN_ESPERA';
  const items = order.items || [];
  const notes = order.notes || '';
  const total = order.total || items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);
  const branchName = order.restaurant?.name || order.restaurant?.nombre || 'Sucursal Gourmet';

  const canCancel = ['ABIERTA', 'EN_ESPERA'].includes(status.toUpperCase());

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
      
      {/* Header del Card */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-base text-slate-800">
              Pedido #{displayId}
            </span>
            <OrderStatusBadge status={status} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(date)}
          </p>
        </div>

        <div className="text-right">
          <span className="font-heading font-extrabold text-lg text-emerald-600 block">
            {formatCurrency(total)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            {items.length} platillo(s)
          </span>
        </div>
      </div>

      {/* Resumen de los primeros ítems */}
      <div className="space-y-1.5 text-xs text-slate-600">
        <p className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {branchName}
        </p>
        
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
          {items.slice(0, 3).map((it, idx) => {
            const itemName = it.menuItem?.name || it.menuItem?.nombre || 'Platillo';
            return (
              <div key={idx} className="flex justify-between text-slate-700">
                <span className="truncate pr-2">
                  <span className="font-bold text-slate-900">{it.quantity || 1}x</span> {itemName}
                </span>
                <span className="font-semibold shrink-0">{formatCurrency((it.price || 0) * (it.quantity || 1))}</span>
              </div>
            );
          })}
          {items.length > 3 && (
            <p className="text-[11px] font-bold text-blue-600 pt-1">
              + {items.length - 3} platillo(s) más en esta orden
            </p>
          )}
        </div>

        {notes && (
          <p className="text-[11px] italic text-slate-400 pt-1 line-clamp-1">
            Notas: "{notes}"
          </p>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        {canCancel && onCancelOrder ? (
          <button
            onClick={() => onCancelOrder(orderId)}
            className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            <Ban className="w-3.5 h-3.5" /> Cancelar
          </button>
        ) : <div />}

        <Link
          to={`/orders/${orderId}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all shadow-sm"
        >
          <span>Ver Seguimiento en Vivo</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
