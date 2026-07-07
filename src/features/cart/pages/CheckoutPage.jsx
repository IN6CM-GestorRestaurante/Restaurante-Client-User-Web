import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Utensils, CheckCircle, ArrowLeft, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore.js';
import { useBranchStore } from '../../branches/store/branchStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { createOrderRequest } from '../../../shared/api/user.service.js';
import { CartItem } from '../components/CartItem.jsx';
import { CartSummary } from '../components/CartSummary.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const { items, clearCart, orderType, setOrderType, tableNumber, setTableNumber, notes, setGeneralNotes } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD' or 'CASH'
  const [loading, setLoading] = useState(false);

  const handleCheckoutSubmit = async () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!selectedBranch) {
      toast.error('Debes seleccionar una sucursal activa antes de confirmar el pedido.');
      return;
    }

    if (orderType === 'DINE_IN' && !tableNumber) {
      toast.error('Por favor ingresa tu número de mesa.');
      return;
    }

    setLoading(true);
    try {
      // ID hexadecimal fallback de 24 caracteres por si el backend requiere ObjectId estricto
      const fallbackMongoId = '60c72b2f9b1d8b001f8e4c3a';
      const branchId = selectedBranch._id || selectedBranch.id || fallbackMongoId;
      const userId = user?.mongoId || user?._id || user?.id || fallbackMongoId;

      const payload = {
        restaurant: branchId,
        table: fallbackMongoId, // En un sistema real se buscaría el ObjectId de la mesa según el número
        waiter: userId, // En auto-servicio web se puede asignar al cliente como responsable inicial
        user: userId,
        items: items.map((item) => ({
          menuItem: item.menuItem._id || item.menuItem.id || fallbackMongoId,
          quantity: item.quantity,
          modifiers: item.modifiers || [],
          status: 'EN_ESPERA',
          notes: item.notes || '',
          price: item.price || 0,
        })),
        status: 'ABIERTA',
        notes: `[Tipo: ${orderType}] ${orderType === 'DINE_IN' ? `Mesa: ${tableNumber}` : 'Para Llevar'}. ${notes}`,
      };

      const res = await createOrderRequest(payload);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        toast.success('¡Pedido confirmado y enviado a cocina con éxito!', {
          icon: '🎉',
          duration: 5000,
          style: {
            borderRadius: '12px',
            background: '#10B981',
            color: '#fff',
          },
        });
        clearCart();
        navigate('/orders');
      } else {
        throw new Error(res.data?.message || 'No se pudo crear el pedido');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const msg = error.response?.data?.message || error.message || 'Error al procesar el pedido en el servidor';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-800">Tu carrito está vacío</h2>
        <p className="text-sm text-slate-500">No puedes proceder al checkout sin antes agregar platillos al pedido.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link to="/catalog" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Continuar Pidiendo
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
            Confirmación de Pedido (Checkout)
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
          <ShieldCheck className="w-4 h-4" /> Transacción Segura
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda / Centro: Detalles del pedido y entrega */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Sucursal y Consumo */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-blue-600" /> 1. Sucursal y Modalidad de Consumo
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">📍 Sucursal Seleccionada:</span>
                <p className="text-slate-600 text-sm font-semibold mt-0.5">
                  {selectedBranch?.name || selectedBranch?.nombre || 'Sucursal Central Gourmet'}
                </p>
                <p className="text-slate-400 text-[11px]">{selectedBranch?.address || selectedBranch?.direccion || 'Av. Principal 123'}</p>
              </div>
              <Link to="/catalog" className="text-blue-600 font-bold hover:underline">Cambiar</Link>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ¿Cómo deseas recibir tu pedido?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setOrderType('DINE_IN')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    orderType === 'DINE_IN'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">En Mesa</p>
                    <p className="text-xs text-slate-500">Estoy en el restaurante</p>
                  </div>
                </div>

                <div
                  onClick={() => setOrderType('TAKEAWAY')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    orderType === 'TAKEAWAY'
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">Para Llevar / Pick-up</p>
                    <p className="text-xs text-slate-500">Lo recojo en el mostrador</p>
                  </div>
                </div>
              </div>

              {orderType === 'DINE_IN' && (
                <div className="pt-2 animate-fadeIn">
                  <Input
                    label="Número de Mesa *"
                    placeholder="Ej. 12"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    helperText="Revisa el identificador en el centro de tu mesa o código QR"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Método de Pago */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-emerald-500" /> 2. Método de Pago
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'CARD' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold text-sm text-slate-800">Tarjeta / Online</p>
                  <p className="text-xs text-slate-500">Débito, Crédito o Terminal</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('CASH')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'CASH' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold text-sm text-slate-800">Efectivo / Caja</p>
                  <p className="text-xs text-slate-500">Pago en caja o mostrador</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Notas Generales para Cocina (Opcional)
              </label>
              <textarea
                rows="2"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
                placeholder="Ej. Por favor enviar todo junto al salir. Alergia a las nueces."
                value={notes}
                onChange={(e) => setGeneralNotes(e.target.value)}
              />
            </div>
          </div>

          {/* 3. Resumen de Platillos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Utensils className="w-5 h-5 text-slate-600" /> 3. Platillos en el Pedido ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <CartItem key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>

        </div>

        {/* Columna Derecha: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartSummary
              items={items}
              onCheckout={handleCheckoutSubmit}
              isLoading={loading}
              showButton={true}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
