import React, { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { useBranchStore } from '../../branches/store/branchStore.js';
import { createReservationRequest } from '../../../shared/api/user.service.js';
import { Calendar, Clock, Users, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReservationForm = ({ isOpen, onClose, selection, onSuccess }) => {
  const { selectedBranch } = useBranchStore();
  const [notes, setNotes] = useState('');
  const [specialOccasion, setSpecialOccasion] = useState('NINGUNA'); // CUMPLEAÑOS, ANIVERSARIO, NEGOCIOS
  const [loading, setLoading] = useState(false);

  if (!isOpen || !selection) return null;

  const { table, date, time, partySize } = selection;
  const tableNum = table?.number || table?.numero || '1';
  const tableId = table?._id || table?.id || '60c72b2f9b1d8b001f8e4c3a';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const branchId = selectedBranch?._id || selectedBranch?.id || '60c72b2f9b1d8b001f8e4c3a';

      const occasionLabel = specialOccasion !== 'NINGUNA' ? `[Ocasión: ${specialOccasion}] ` : '';

      const payload = {
        restaurant: branchId,
        type: 'En Mesa',
        table: tableId,
        // Se construye sin forzar UTC ('Z') para que la hora elegida se interprete
        // en la zona horaria local del usuario, no siempre como UTC.
        date: new Date(`${date}T${time}:00`).toISOString(),
        guestsCount: Number(partySize) || 1,
        notes: `${occasionLabel}${notes}`.trim(),
      };

      await createReservationRequest(payload);
      toast.success('¡Reservación enviada! Queda pendiente de confirmación del restaurante.', {
        icon: '🥂',
        duration: 5000,
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Reservation confirm error:', error);
      toast.error(error.response?.data?.message || error.message || 'Error al procesar la reservación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🥂 Confirmar Reservación de Mesa" maxWidth="max-w-lg">
      <div className="space-y-5 animate-fadeIn">
        
        {/* Resumen de la selección */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="font-heading font-extrabold text-base text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {selectedBranch?.name || 'Sucursal Gourmet'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-xs">
              Mesa #{tableNum}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{time} hrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{partySize} personas</span>
            </div>
          </div>
        </div>

        {/* Ocasión especial */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ¿Celebras alguna ocasión especial?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['NINGUNA', 'CUMPLEAÑOS', 'ANIVERSARIO', 'NEGOCIOS'].map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSpecialOccasion(occ)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                  specialOccasion === occ
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {occ === 'CUMPLEAÑOS' ? '🎂 Cumpleaños' : occ === 'ANIVERSARIO' ? '💍 Aniversario' : occ === 'NEGOCIOS' ? '💼 Negocios' : 'Mesa Estándar'}
              </button>
            ))}
          </div>
        </div>

        {/* Peticiones especiales */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Comentarios o requerimientos adicionales:
          </label>
          <textarea
            rows="2"
            placeholder="Ej. Silla para bebé, mesa alejada del ruido, alergias alimentarias..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Botones */}
        <div className="pt-3 border-t border-slate-100 flex gap-3">
          <Button variant="outline" size="lg" className="w-1/3 font-bold" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="emerald"
            size="lg"
            className="w-2/3 font-extrabold shadow-lg shadow-emerald-500/25"
            onClick={handleConfirm}
            isLoading={loading}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Reservación</span>
          </Button>
        </div>

      </div>
    </Modal>
  );
};
