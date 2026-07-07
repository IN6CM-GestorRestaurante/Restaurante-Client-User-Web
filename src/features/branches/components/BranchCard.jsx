import React from 'react';
import { MapPin, Phone, Clock, CheckCircle2, Info } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';

export const BranchCard = ({ branch, isSelected, onSelect }) => {
  const name = branch.name || branch.nombre || 'Sucursal Gourmet';
  const address = branch.address || branch.direccion || 'Av. Principal 123';
  const phone = branch.phoneNumber || branch.phone || branch.telefono || '+502 2345-6789';
  const hours =
    branch.openingTime && branch.closingTime
      ? `${branch.openingTime} - ${branch.closingTime}`
      : branch.hours || branch.horario || '12:00 PM - 11:00 PM';
  const description = branch.description || branch.descripcion;
  const state = branch.state || 'Operativa';
  const isMaintenance = state === 'En mantenimiento';

  return (
    <div
      onClick={() => onSelect(branch)}
      className={`relative rounded-2xl p-5 border transition-all cursor-pointer select-none bg-white ${
        isSelected
          ? 'border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
          : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSelected ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-slate-800 text-base leading-tight">
              {name}
            </h4>
            <span
              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                isMaintenance
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isMaintenance ? '🛠️ En Mantenimiento' : '🟢 Abierto Ahora'}
            </span>
          </div>
        </div>

        {isSelected && (
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 animate-scaleUp" />
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-600 mb-2 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
          {description}
        </p>
      )}

      <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <p className="flex items-center gap-2 truncate">
          <span className="font-medium text-slate-700">📍</span> {address}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {hours}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {phone}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <Button
          variant={isSelected ? 'emerald' : 'outline'}
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(branch);
          }}
        >
          {isSelected ? '✓ Sucursal Activa' : 'Seleccionar Sucursal'}
        </Button>
      </div>
    </div>
  );
};
