import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/catalog';

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      toast.success('¡Bienvenido de vuelta a Restaurante Gourmet!', {
        icon: '👨‍🍳',
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      navigate(from, { replace: true });
    } else {
      toast.error(res.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
          Iniciar Sesión
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingresa tus credenciales para acceder a tus pedidos, reservas y favoritos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Correo Electrónico o Usuario"
          placeholder="ej. carlos@example.com o carlos_gourmet"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.emailOrUsername?.message}
          {...register('emailOrUsername', {
            required: 'El correo o nombre de usuario es obligatorio',
          })}
        />

        <div className="space-y-2.5">
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres',
              },
            })}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="emerald"
            size="lg"
            className="w-full font-bold shadow-md shadow-emerald-500/20"
            isLoading={loading}
          >
            <LogIn className="w-4 h-4" />
            <span>Acceder a mi Cuenta</span>
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        ¿Aún no tienes una cuenta en Restaurante Gourmet?{' '}
        <Link
          to="/register"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
        >
          Regístrate aquí gratis
        </Link>
      </div>
    </div>
  );
};
