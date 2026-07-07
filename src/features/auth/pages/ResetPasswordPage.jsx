import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { resetPasswordRequest } from '../../../shared/api/auth.service.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const password = watch('newPassword');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Token de restablecimiento no proporcionado');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPasswordRequest({
        token,
        newPassword: data.newPassword,
      });
      if (res.data?.success || res.status === 200) {
        setSuccess(true);
        toast.success('¡Contraseña actualizada exitosamente!');
      } else {
        throw new Error(res.data?.message || 'Error al restablecer');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || error.message || 'El enlace de recuperación ha expirado');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-10 space-y-4">
        <KeyRound className="w-16 h-16 text-red-500 mx-auto" />
        <h3 className="font-heading font-bold text-xl text-slate-800">Enlace No Válido</h3>
        <p className="text-xs text-slate-500">No se encontró el token de restablecimiento en la URL.</p>
        <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
          Solicitar un nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
          Nueva Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Elige una contraseña segura que recuerdes fácilmente para tu cuenta.
        </p>
      </div>

      {success ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h4 className="font-heading font-bold text-emerald-800 text-base">¡Contraseña Actualizada!</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Tu nueva contraseña ha sido guardada. Ahora puedes acceder a tu cuenta gourmet con tus nuevas credenciales.
          </p>
          <div className="pt-3">
            <Button variant="emerald" size="lg" onClick={() => navigate('/login')} className="w-full font-bold">
              Iniciar Sesión Ahora
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Nueva Contraseña *"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'La nueva contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres',
              },
            })}
          />

          <Input
            label="Confirmar Nueva Contraseña *"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Por favor confirma la contraseña',
              validate: (val) => val === password || 'Las contraseñas no coinciden',
            })}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="emerald"
              size="lg"
              className="w-full font-bold shadow-md shadow-emerald-500/20"
              isLoading={loading}
            >
              <span>Guardar Nueva Contraseña</span>
            </Button>
          </div>
        </form>
      )}

      <div className="pt-4 border-t border-slate-100 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Login
        </Link>
      </div>
    </div>
  );
};
