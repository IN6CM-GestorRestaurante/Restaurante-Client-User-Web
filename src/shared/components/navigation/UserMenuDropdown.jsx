import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Calendar, Clock, ChevronDown, Shield } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { resolveImageUrl } from '../../utils/formatters.js';

export const UserMenuDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const displayName = user?.name ? `${user.name} ${user.surname || ''}`.trim() : user?.username || 'Usuario';
  const avatarUrl = user?.profilePicture || user?.avatar;
  const role = user?.role || 'CLIENT';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
      >
        {avatarUrl ? (
          <img
            src={resolveImageUrl(avatarUrl)}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-emerald-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline font-medium text-xs text-slate-700 max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 animate-scaleUp z-50">
          <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
            <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || '@' + (user?.username || '')}</p>
            {role !== 'CLIENT' && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-semibold">
                <Shield className="w-3 h-3" /> {role}
              </span>
            )}
          </div>

          <div className="space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <User className="w-4 h-4 text-blue-600" />
              Mi Perfil y Direcciones
            </Link>

            <Link
              to="/reservations"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              Mis Reservaciones
            </Link>

            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Clock className="w-4 h-4 text-blue-600" />
              Historial de Pedidos
            </Link>
          </div>

          <div className="mt-1 pt-1 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
