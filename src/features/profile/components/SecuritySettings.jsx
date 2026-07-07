import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { changePasswordRequest, deleteAccountRequest } from '../../../shared/api/auth.service.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';

export const SecuritySettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const passwordForm = useForm();
  const deleteForm = useForm();

  const onChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      await changePasswordRequest(data.currentPassword, data.newPassword);
      toast.success('Contraseña actualizada exitosamente. Vuelve a iniciar sesión.');
      passwordForm.reset();
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cambiar la contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  const onDeleteAccount = async (data) => {
    if (!window.confirm('Esta acción es permanente. ¿Confirmas que deseas eliminar tu cuenta?')) {
      return;
    }
    setDeleting(true);
    try {
      await deleteAccountRequest(data.password);
      toast.success('Tu cuenta ha sido eliminada.');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar la cuenta');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cambio de contraseña */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" /> Cambiar Contraseña
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Después de cambiarla deberás iniciar sesión de nuevo.
          </p>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <Input
            label="Contraseña Actual *"
            type="password"
            leftIcon={<KeyRound className="w-4 h-4" />}
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword', { required: 'La contraseña actual es obligatoria' })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nueva Contraseña *"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword', {
                required: 'La nueva contraseña es obligatoria',
                minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
              })}
            />
            <Input
              label="Confirmar Nueva Contraseña *"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword', {
                required: 'Debes confirmar la nueva contraseña',
                validate: (value) =>
                  value === passwordForm.watch('newPassword') || 'Las contraseñas no coinciden',
              })}
            />
          </div>
          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="emerald" size="lg" className="font-bold" isLoading={changingPassword}>
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>

      {/* Eliminar cuenta */}
      <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm space-y-4">
        <div className="border-b border-red-100 pb-4">
          <h3 className="font-heading font-bold text-lg text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Eliminar Cuenta
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Esta acción desactiva tu cuenta de forma permanente. No podrás iniciar sesión de nuevo.
          </p>
        </div>

        {!showDeleteForm ? (
          <Button variant="danger" size="md" onClick={() => setShowDeleteForm(true)}>
            <Trash2 className="w-4 h-4" />
            Quiero eliminar mi cuenta
          </Button>
        ) : (
          <form onSubmit={deleteForm.handleSubmit(onDeleteAccount)} className="space-y-4">
            <Input
              label="Confirma tu contraseña *"
              type="password"
              leftIcon={<KeyRound className="w-4 h-4" />}
              error={deleteForm.formState.errors.password?.message}
              {...deleteForm.register('password', { required: 'La contraseña es obligatoria' })}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="md" onClick={() => setShowDeleteForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="danger" size="md" isLoading={deleting}>
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta Permanentemente
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
