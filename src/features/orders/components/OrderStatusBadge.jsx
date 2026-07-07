import React from 'react';
import { Clock, CheckCircle2, XCircle, Flame, AlertCircle, Utensils } from 'lucide-react';

export const OrderStatusBadge = ({ status = 'EN_ESPERA', size = 'md' }) => {
  const normalized = status.toUpperCase();

  const configs = {
    ABIERTA: {
      label: 'Abierta / Recibida',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
    },
    EN_ESPERA: {
      label: 'En Cola de Cocina',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
    },
    EN_PREPARACION: {
      label: 'Chefs en Preparación',
      color: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
      icon: Flame,
    },
    LISTO: {
      label: '¡Listo para Servir!',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
      icon: CheckCircle2,
    },
    ENTREGADO: {
      label: 'Entregado / Finalizado',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Utensils,
    },
    CANCELADA: {
      label: 'Pedido Cancelado',
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle,
    },
  };

  const current = configs[normalized] || {
    label: status,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: AlertCircle,
  };

  const Icon = current.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${current.color} ${sizes[size]}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{current.label}</span>
    </span>
  );
};
