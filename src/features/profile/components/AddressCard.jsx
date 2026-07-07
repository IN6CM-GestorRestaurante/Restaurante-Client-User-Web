import React from 'react';
import { MapPin, Trash2, Star, Check } from 'lucide-react';

export const AddressCard = ({ address, isDefault, onDelete, onSetDefault }) => {
  const addrId = address._id || address.id;
  const alias = address.alias || address.name || 'Dirección de Entrega';
  const street = address.street || address.calle || '';
  const ext = address.exteriorNumber || address.numero || '';
  const col = address.neighborhood || address.colonia || '';
  const cp = address.zipCode || address.cp || '';
  const ref = address.reference || address.referencia || '';

  const fullAddr = `${street} #${ext}, Col. ${col}, C.P. ${cp}`.trim();

  return (
    <div
      className={`p-4 rounded-2xl border transition-all bg-white flex flex-col justify-between space-y-3 ${
        isDefault
          ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500/20 bg-emerald-50/10'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDefault ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-2">
              {alias}
              {isDefault && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white">
                  ✓ Predeterminada
                </span>
              )}
            </h5>
          </div>
        </div>

        <button
          onClick={() => onDelete(addrId)}
          title="Eliminar dirección"
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 space-y-1 pl-10">
        <p className="font-semibold text-slate-800">{fullAddr}</p>
        {ref && <p className="text-slate-400 italic">Ref: "{ref}"</p>}
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end pl-10">
        {!isDefault ? (
          <button
            onClick={() => onSetDefault(addrId)}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5" /> Establecer como predeterminada
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Dirección activa para envíos
          </span>
        )}
      </div>
    </div>
  );
};
