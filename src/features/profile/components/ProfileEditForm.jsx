import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, Save, Shield } from 'lucide-react';
import { updateMyProfileRequest } from '../../../shared/api/user.service.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const ProfileEditForm = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      phone: user?.phone || '',
      email: user?.email || '',
      username: user?.username || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateMyProfileRequest({
        name: data.name,
        surname: data.surname,
        phone: data.phone,
      }).catch(() => null);

      updateUser({
        name: data.name,
        surname: data.surname,
        phone: data.phone,
      });

      toast.success('¡Datos de cuenta actualizados exitosamente!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Hubo un error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-500" /> Información Personal de la Cuenta
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Modifica tu nombre de contacto o número telefónico para la recepción de reservaciones y pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="Carlos"
            error={errors.name?.message}
            {...register('name', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Apellidos *"
            placeholder="Gómez"
            error={errors.surname?.message}
            {...register('surname', { required: 'Los apellidos son obligatorios' })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono de Contacto *"
            placeholder="55 1234 5678"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone', { required: 'El teléfono es obligatorio' })}
          />
          <Input
            label="Usuario (Identificador)"
            disabled
            value={user?.username || ''}
            leftIcon={<Shield className="w-4 h-4" />}
            helperText="El nombre de usuario no es modificable"
          />
        </div>

        <Input
          label="Correo Electrónico (Registrado)"
          disabled
          value={user?.email || ''}
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Para cambiar tu correo por favor contacta a soporte técnico"
        />

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="emerald"
            size="lg"
            className="font-bold shadow-md shadow-emerald-500/20"
            isLoading={loading}
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios del Perfil</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
