import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { forgotPasswordRequest } from '../../../shared/api/auth.service.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPasswordRequest(data.email);
      setSent(true);
      toast.success('Enlace de recuperación enviado con éxito');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || error.message || 'No se pudo enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
          Recuperar Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
      </div>

      {sent ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-emerald-800 text-base">¡Correo Enviado!</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Revisa tu bandeja de entrada o carpeta de spam y sigue el enlace de recuperación para crear una nueva contraseña.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
            >
              Volver al Inicio de Sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Correo Electrónico Registrado"
            type="email"
            placeholder="ej. carlos@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Ingresa un correo válido',
              },
            })}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="w-full font-bold shadow-md shadow-blue-600/20"
              isLoading={loading}
            >
              <Send className="w-4 h-4" />
              <span>Enviar Enlace de Restablecimiento</span>
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
