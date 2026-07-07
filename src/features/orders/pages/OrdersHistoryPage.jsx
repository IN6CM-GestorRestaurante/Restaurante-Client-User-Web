import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { getMyOrdersRequest, cancelOrderRequest } from '../../../shared/api/user.service.js';
import { OrderCard } from '../components/OrderCard.jsx';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

// Pedidos de demostración para cuando la BD aún no tenga historial del usuario
const FALLBACK_ORDERS = [
  {
    _id: 'ORD-88231',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'EN_PREPARACION',
    total: 870,
    notes: '[Tipo: DINE_IN] Mesa: 4. Todo al centro por favor.',
    restaurant: { name: 'Sucursal Central Gourmet' },
    items: [
      { menuItem: { name: 'Ribeye Prime a las Brasas' }, quantity: 1, price: 680 },
      { menuItem: { name: 'Tarta Tibia de Chocolate' }, quantity: 1, price: 190 },
    ],
  },
  {
    _id: 'ORD-77412',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'ENTREGADO',
    total: 450,
    notes: '[Tipo: TAKEAWAY] Para Llevar. Salsa picante extra.',
    restaurant: { name: 'Sucursal Terraza Gourmet' },
    items: [
      { menuItem: { name: 'Salmón Glaseado al Miso' }, quantity: 1, price: 450 },
    ],
  },
];

export const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' or 'COMPLETED'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrdersRequest().catch(() => null);
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setOrders(list);
      } else {
        setOrders(FALLBACK_ORDERS);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(FALLBACK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
    try {
      await cancelOrderRequest(id);
      toast.success('Pedido cancelado correctamente');
      fetchOrders();
    } catch {
      // Si estamos en demo o falla el backend, actualizar en memoria
      setOrders((prev) =>
        prev.map((ord) => ((ord._id || ord.id) === id ? { ...ord, status: 'CANCELADA' } : ord))
      );
      toast.success('Pedido cancelado (en memoria de prueba)');
    }
  };

  const activeOrders = orders.filter((o) => {
    const st = (o.status || '').toUpperCase();
    return !['ENTREGADO', 'CANCELADA', 'COMPLETADA'].includes(st);
  });

  const completedOrders = orders.filter((o) => {
    const st = (o.status || '').toUpperCase();
    return ['ENTREGADO', 'CANCELADA', 'COMPLETADA'].includes(st);
  });

  const displayedOrders = activeTab === 'ACTIVE' ? activeOrders : completedOrders;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Banner / Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-2">
            Seguimiento en Vivo y Registro
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
            Mis Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisa el estado de cocción de tus órdenes activas o revisa tus visitas pasadas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Actualizar</span>
          </button>
          <Link
            to="/catalog"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`pb-3 font-heading font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ACTIVE'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pedidos Activos en Cocina ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETADA')}
          className={`pb-3 font-heading font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
            activeTab !== 'ACTIVE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Historial Pasado ({completedOrders.length})</span>
        </button>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="xl" color="text-emerald-500" />
          <p className="text-sm font-medium text-slate-500">Cargando el historial gastronómico...</p>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3 p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-bold text-lg text-slate-800">
            {activeTab === 'ACTIVE' ? 'No tienes pedidos activos en cocina' : 'Sin pedidos pasados'}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === 'ACTIVE'
              ? 'Explora nuestro menú y realiza tu pedido para disfrutar del mejor sabor directamente en tu mesa o mostrador.'
              : 'Aún no has completado órdenes en nuestra plataforma. ¡Anímate a probar nuestros platillos estrella!'}
          </p>
          <div className="pt-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors"
            >
              Ir al Menú Gourmet
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedOrders.map((ord, idx) => {
            const ordId = ord._id || ord.id || idx;
            return <OrderCard key={ordId} order={ord} onCancelOrder={handleCancelOrder} />;
          })}
        </div>
      )}

    </div>
  );
};
