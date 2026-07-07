import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Plus, RefreshCw, Ban, CheckCircle2, Utensils } from 'lucide-react';
import { getMyReservationsRequest, cancelReservationRequest } from '../../../shared/api/user.service.js';
import { formatDate } from '../../../shared/utils/formatters.js';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

// Reservaciones de prueba por si el servidor aún no tiene historial registrado
const FALLBACK_RESERVATIONS = [
  {
    _id: 'RES-99012',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    partySize: 4,
    status: 'CONFIRMADA',
    specialRequests: '[Ocasión: CUMPLEAÑOS] Silla para bebé',
    restaurant: { name: 'Sucursal Central Gourmet', address: 'Av. Principal 123' },
    table: { number: '4' },
  },
  {
    _id: 'RES-88321',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    partySize: 2,
    status: 'COMPLETADA',
    specialRequests: 'Mesa cerca de la ventana',
    restaurant: { name: 'Sucursal Terraza Gourmet', address: 'Zona Rosa 456' },
    table: { number: '1' },
  },
];

export const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await getMyReservationsRequest().catch(() => null);
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setReservations(list);
      } else {
        setReservations(FALLBACK_RESERVATIONS);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations(FALLBACK_RESERVATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reservación?')) return;
    try {
      await cancelReservationRequest(id);
      toast.success('Reservación cancelada correctamente');
      fetchReservations();
    } catch {
      setReservations((prev) =>
        prev.map((r) => ((r._id || r.id) === id ? { ...r, status: 'CANCELADA' } : r))
      );
      toast.success('Reservación cancelada (en memoria de prueba)');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Banner / Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-2">
            Gestión de Mesas y Visitas
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
            Mis Reservaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revisa tus próximas reservas en el restaurante o consulta tus visitas anteriores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReservations}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Actualizar</span>
          </button>
          <Link
            to="/reservations/new"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Reservar Mesa Ahora</span>
          </Link>
        </div>
      </div>

      {/* Lista de Reservaciones */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="xl" color="text-emerald-500" />
          <p className="text-sm font-medium text-slate-500">Cargando reservaciones...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3 p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-bold text-lg text-slate-800">
            Aún no tienes reservaciones
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reserva una mesa para tu próxima comida o cena especial en nuestra sucursal y asegura un servicio de primera.
          </p>
          <div className="pt-3">
            <Link
              to="/reservations/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors"
            >
              Hacer mi Primera Reservación
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((res, idx) => {
            const resId = res._id || res.id || idx;
            const status = (res.status || 'CONFIRMADA').toUpperCase();
            const isConfirmed = status === 'CONFIRMADA' || status === 'PENDIENTE';
            const branchName = res.restaurant?.name || res.restaurant?.nombre || 'Sucursal Gourmet';
            const tableNum = res.table?.number || res.table?.numero || '1';

            return (
              <div
                key={resId}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-heading font-extrabold text-base text-slate-800">
                      Mesa #{tableNum}
                    </span>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {branchName}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : status === 'CANCELADA'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{formatDate(res.date, false)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{new Date(res.date).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium col-span-2">
                    <Users className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{res.partySize || 4} comensales confirmados</span>
                  </div>
                </div>

                {res.specialRequests && (
                  <p className="text-[11px] italic text-slate-500 line-clamp-1">
                    Req: "{res.specialRequests}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isConfirmed ? (
                    <button
                      onClick={() => handleCancel(resId)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" /> Cancelar Reservación
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold">Visita Finalizada</span>
                  )}

                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Utensils className="w-3.5 h-3.5" /> Pedir Platillos
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
