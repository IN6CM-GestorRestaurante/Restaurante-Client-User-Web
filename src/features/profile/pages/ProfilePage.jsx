import React from 'react';
import { User, MapPin, Shield } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore.js';
import { AvatarUploader } from '../components/AvatarUploader.jsx';
import { ProfileEditForm } from '../components/ProfileEditForm.jsx';
import { AddressManager } from '../components/AddressManager.jsx';
import { SecuritySettings } from '../components/SecuritySettings.jsx';

export const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Banner / Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-md">
            {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
                {user?.name ? `${user.name} ${user.surname || ''}` : user?.username || 'Usuario Gourmet'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] uppercase flex items-center gap-1">
                <Shield className="w-3 h-3" /> {user?.role || 'CLIENT'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {user?.email || '@' + (user?.username || '')} • Miembro de la Comunidad Gourmet
            </p>
          </div>
        </div>
      </div>

      {/* Componente 1: Carga de Avatar */}
      <AvatarUploader currentAvatar={user?.profilePicture || user?.avatar} />

      {/* Componente 2: Edición de Datos */}
      <ProfileEditForm />

      {/* Componente 3: Gestión de Direcciones */}
      <AddressManager />

      {/* Componente 4: Seguridad (cambio de contraseña, eliminar cuenta) */}
      <SecuritySettings />
    </div>
  );
};
