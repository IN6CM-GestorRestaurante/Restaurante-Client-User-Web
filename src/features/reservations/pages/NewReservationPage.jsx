import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TableAvailabilityChecker } from '../components/TableAvailabilityChecker.jsx';
import { ReservationForm } from '../components/ReservationForm.jsx';

export const NewReservationPage = () => {
  const [selectedTableSelection, setSelectedTableSelection] = useState(null);
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link to="/reservations" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Mis Reservaciones
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
            Nueva Reservación de Mesa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reserva con anticipación en tu sucursal favorita y asegura una experiencia gastronómica perfecta.
          </p>
        </div>
      </div>

      {success ? (
        <div className="p-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="font-heading font-extrabold text-2xl text-slate-800">¡Tu Mesa está Confirmada!</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hemos registrado tu reservación en nuestro sistema. Te pedimos puntualidad y te agradecemos por elegir Restaurante Gourmet.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/reservations"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
            >
              Ver Mis Reservaciones
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setSelectedTableSelection(null);
              }}
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Hacer Otra Reservación
            </button>
          </div>
        </div>
      ) : (
        <>
          <TableAvailabilityChecker
            onSelectTable={(selection) => setSelectedTableSelection(selection)}
          />

          <ReservationForm
            isOpen={Boolean(selectedTableSelection)}
            onClose={() => setSelectedTableSelection(null)}
            selection={selectedTableSelection}
            onSuccess={() => {
              setSelectedTableSelection(null);
              setSuccess(true);
            }}
          />
        </>
      )}
    </div>
  );
};
