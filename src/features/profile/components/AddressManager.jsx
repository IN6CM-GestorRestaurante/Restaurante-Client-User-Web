import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, MapPin, Check, X } from 'lucide-react';
import { addAddressRequest, removeAddressRequest, setDefaultAddressRequest } from '../../../shared/api/user.service.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { AddressCard } from './AddressCard.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const AddressManager = () => {
  const { user, updateUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const addresses = user?.addresses || [
    { _id: '1', alias: 'Casa Principal', street: 'Av. Gastronómica', exteriorNumber: '456', neighborhood: 'Zona Gourmet', zipCode: '01230', isDefault: true },
  ];

  const handleAdd = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        isDefault: addresses.length === 0,
      };
      await addAddressRequest(payload).catch(() => null);
      
      const newAddr = { ...payload, _id: crypto.randomUUID() };
      const updatedList = [...addresses, newAddr];
      updateUser({ addresses: updatedList });
      
      toast.success('Dirección guardada exitosamente');
      reset();
      setShowForm(false);
    } catch {
      toast.error('No se pudo guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta dirección de entrega?')) return;
    try {
      await removeAddressRequest(id).catch(() => null);
      const updatedList = addresses.filter((a) => (a._id || a.id) !== id);
      updateUser({ addresses: updatedList });
      toast.success('Dirección eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddressRequest(id).catch(() => null);
      const updatedList = addresses.map((a) => ({
        ...a,
        isDefault: (a._id || a.id) === id,
      }));
      updateUser({ addresses: updatedList });
      toast.success('Dirección predeterminada actualizada');
    } catch {
      toast.error('Error al actualizar predeterminada');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Direcciones de Entrega Guardadas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra tus domicilios para recibir tus pedidos de comida a domicilio con mayor rapidez.
          </p>
        </div>

        {!showForm && (
          <Button variant="emerald" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Agregar Dirección
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(handleAdd)} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-heading font-bold text-sm text-slate-800">Nueva Dirección de Entrega</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Alias (Ej. Casa, Oficina) *"
              placeholder="Mi Casa"
              error={errors.alias?.message}
              {...register('alias', { required: 'Requerido' })}
            />
            <Input
              label="Calle *"
              placeholder="Av. Gastronomía"
              error={errors.street?.message}
              {...register('street', { required: 'Requerido' })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="No. Exterior *"
              placeholder="123"
              error={errors.exteriorNumber?.message}
              {...register('exteriorNumber', { required: 'Requerido' })}
            />
            <Input
              label="Colonia *"
              placeholder="Centro"
              error={errors.neighborhood?.message}
              {...register('neighborhood', { required: 'Requerido' })}
            />
            <Input
              label="C.P. *"
              placeholder="01230"
              error={errors.zipCode?.message}
              {...register('zipCode', { required: 'Requerido' })}
            />
          </div>

          <Input
            label="Referencias de Entrega (Opcional)"
            placeholder="Ej. Portón blanco, frente al parque, timbre 2B..."
            {...register('reference')}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="emerald" size="sm" isLoading={loading}>
              <Check className="w-4 h-4" /> Guardar Dirección
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr, idx) => {
          const id = addr._id || addr.id || idx;
          return (
            <AddressCard
              key={id}
              address={addr}
              isDefault={addr.isDefault}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          );
        })}
      </div>
    </div>
  );
};
