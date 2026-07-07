import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Upload, UserPlus } from 'lucide-react';
import { registerRequest } from '../../../shared/api/auth.service.js';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const password = watch('password');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La fotografía excede los 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('surname', data.surname);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('role', 'CLIENT');
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const res = await registerRequest(formData);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        toast.success(
          res.data?.message || '¡Registro exitoso! Por favor revisa tu correo electrónico para verificar tu cuenta.',
          { duration: 6000, icon: '🎉' }
        );
        navigate('/login');
      } else {
        throw new Error(res.data?.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Register error:', error);
      const msg = error.response?.data?.message || error.message || 'Hubo un problema con el registro en el servidor';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
          Crear Cuenta Gratis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Únete a nuestra comunidad gourmet para agilizar tus pedidos y disfrutar de beneficios.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Avatar Uploader Preview */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-emerald-500 shrink-0 shadow-sm">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-slate-400" />
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 mb-0.5">Fotografía de Perfil (Opcional)</label>
            <p className="text-[11px] text-slate-400 mb-2">Sube una imagen o avatar culinario (máx 5MB)</p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seleccionar Archivo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input
            label="Nombre *"
            placeholder="Carlos"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Requerido' })}
          />
          <Input
            label="Apellidos *"
            placeholder="Gómez"
            error={errors.surname?.message}
            {...register('surname', { required: 'Requerido' })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input
            label="Usuario *"
            placeholder="carlos_gourmet"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.username?.message}
            {...register('username', {
              required: 'Requerido',
              pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Alfanumérico y _' },
            })}
          />
          <Input
            label="Teléfono *"
            placeholder="55 1234 5678"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone', { required: 'Requerido' })}
          />
        </div>

        <Input
          label="Correo Electrónico *"
          type="email"
          placeholder="carlos@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Requerido',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' },
          })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input
            label="Contraseña *"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Requerido',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          <Input
            label="Confirmar Contraseña *"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Requerido',
              validate: (val) => val === password || 'Las contraseñas no coinciden',
            })}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="emerald"
            size="lg"
            className="w-full font-bold shadow-md shadow-emerald-500/20"
            isLoading={loading}
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear mi Cuenta Gourmet</span>
          </Button>
        </div>
      </form>

      <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
        ¿Ya tienes una cuenta registrada?{' '}
        <Link
          to="/login"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};
