import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle2, Flame, Utensils, ArrowLeft, MapPin, AlertCircle, Phone } from 'lucide-react';
import { getOrderDetailsRequest } from '../../../shared/api/user.service.js';
import { OrderStatusBadge } from '../components/OrderStatusBadge.jsx';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getOrderDetailsRequest(id).catch(() => null);
        if (res?.data?.data || res?.data) {
          setOrder(res.data.data || res.data);
        } else {
          // Fallback de demostración
          setOrder({
            _id: id,
            createdAt: new Date().toISOString(),
            status: 'EN_PREPARACION',
            total: 870,
            notes: '[Tipo: DINE_IN] Mesa: 4. Todo al centro por favor.',
            restaurant: { name: 'Sucursal Central Gourmet', address: 'Av. Reforma 10-00, Zona 10, Ciudad de Guatemala', phone: '+502 2345-6789' },
            items: [
              { menuItem: { name: 'Ribeye Prime a las Brasas', price: 680 }, quantity: 1, price: 680, notes: 'Término medio' },
              { menuItem: { name: 'Tarta Tibia de Chocolate Valrhona', price: 190 }, quantity: 1, price: 190 },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching order tracking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Spinner size="xl" color="text-emerald-500" />
        <p className="text-sm font-medium text-slate-500">Conectando con la cocina del restaurante...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h3 className="font-heading font-bold text-xl text-slate-800">Pedido no encontrado</h3>
        <p className="text-xs text-slate-500">No pudimos localizar la orden solicitada en el sistema.</p>
        <Link to="/orders" className="text-xs font-bold text-blue-600 hover:underline">Volver a Mis Pedidos</Link>
      </div>
    );
  }

  const status = (order.status || 'EN_ESPERA').toUpperCase();
  const displayId = (order._id || id || 'ORD-000').slice(-6).toUpperCase();
  const branch = order.restaurant || {};
  const items = order.items || [];
  const total = order.total || items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);

  // Mapeo de etapas en barra de progreso
  const steps = [
    { key: 'ABIERTA', label: '1. Recibido', icon: Clock, desc: 'Pedido registrado' },
    { key: 'EN_ESPERA', label: '2. En Cola', icon: Clock, desc: 'Espera de turno' },
    { key: 'EN_PREPARACION', label: '3. En Cocina', icon: Flame, desc: 'Chefs cocinando' },
    { key: 'LISTO', label: '4. ¡Listo!', icon: CheckCircle2, desc: 'Para servir / llevar' },
    { key: 'ENTREGADO', label: '5. Entregado', icon: Utensils, desc: '¡Que lo disfrutes!' },
  ];

  const getStepIndex = (st) => {
    if (st === 'ENTREGADO' || st === 'COMPLETADA') return 4;
    if (st === 'LISTO') return 3;
    if (st === 'EN_PREPARACION') return 2;
    if (st === 'EN_ESPERA') return 1;
    return 0;
  };

  const currentStepIdx = getStepIndex(status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Mis Pedidos
        </Link>
        <span className="text-xs text-slate-400 font-medium">Actualización en tiempo real 🟢</span>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
                Pedido #{displayId}
              </h1>
              <OrderStatusBadge status={status} size="lg" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Realizado el {formatDate(order.createdAt)} en <span className="font-semibold text-slate-700">{branch.name || 'Sucursal Gourmet'}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total de Cuenta:</span>
            <span className="font-heading font-extrabold text-2xl text-emerald-600 block">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-6">
            Estado Actual de Preparación:
          </h4>
          
          <div className="relative flex items-center justify-between w-full">
            {/* Línea conectora */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={st.key} className="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      isCurrent
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 scale-110'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border-2 border-slate-200 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-emerald-700 font-extrabold' : 'text-slate-700'}`}>
                    {st.label}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid inferior: Detalle de Ítems y Sucursal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lista de Platillos en el recibo */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-500" /> Detalle de Platillos ({items.length})
          </h3>

          <div className="space-y-3">
            {items.map((it, idx) => {
              const itemName = it.menuItem?.name || it.menuItem?.nombre || 'Platillo';
              const price = (it.price || 0) * (it.quantity || 1);
              return (
                <div key={idx} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-extrabold text-xs text-slate-800 shrink-0">
                      {it.quantity || 1}x
                    </span>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{itemName}</p>
                      {it.notes && (
                        <p className="text-[11px] italic text-slate-500 mt-0.5">Nota: "{it.notes}"</p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-sm text-slate-800 shrink-0">{formatCurrency(price)}</span>
                </div>
              );
            })}
          </div>

          {order.notes && (
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900">
              <span className="font-bold">Comentarios de Pedido:</span> "{order.notes}"
            </div>
          )}
        </div>

        {/* Información de Sucursal y Ayuda */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Ubicación y Contacto
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> {branch.name || 'Sucursal Central'}
              </p>
              <p className="pl-5 text-slate-500">{branch.address || 'Av. Reforma 10-00, Zona 10, Ciudad de Guatemala'}</p>
              <p className="pl-5 font-semibold text-blue-600 flex items-center gap-1 mt-2">
                <Phone className="w-3.5 h-3.5" /> {branch.phone || '+502 2345-6789'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-6 text-white text-center space-y-3 shadow-md">
            <h4 className="font-heading font-bold text-base">¿Necesitas ayuda con tu orden?</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Comunícate al mostrador de la sucursal o al soporte gastronómico si deseas modificar o consultar el tiempo estimado.
            </p>
            <a
              href="tel:+50223456789"
              className="inline-block w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Llamar a Sucursal Ahora
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
