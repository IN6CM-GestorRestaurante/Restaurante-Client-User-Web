import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, MapPin, Menu as MenuIcon, X, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { useCartStore } from '../../../features/cart/store/cartStore.js';
import { useBranchStore } from '../../../features/branches/store/branchStore.js';
import { UserMenuDropdown } from './UserMenuDropdown.jsx';

export const Navbar = ({ onOpenCart, onOpenBranchModal }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { getTotalCount } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getTotalCount();
  const appName = selectedBranch?.name || selectedBranch?.nombre || import.meta.env.VITE_APP_NAME || 'Restaurante Gourmet';

  const navLinks = [
    { name: 'Catálogo y Menú', path: '/catalog', icon: Utensils },
    { name: 'Reservar Mesa', path: '/reservations', icon: Calendar },
    { name: 'Mis Pedidos', path: '/orders', icon: Clock },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-6">
            <Link to="/catalog" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:bg-emerald-600 transition-colors">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                {appName}
              </span>
            </Link>

            {/* Selector rápido de sucursal (Desktop) */}
            <button
              onClick={onOpenBranchModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors text-xs font-medium border border-slate-200 hover:border-blue-200"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[150px]">
                {selectedBranch?.name || selectedBranch?.nombre || 'Seleccionar Sucursal'}
              </span>
            </button>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart Badge & User Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Ver carrito de compras"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors border border-slate-200 hover:border-emerald-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white font-bold text-[11px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 shadow-sm shadow-emerald-500/30 animate-bounce">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth / User dropdown */}
            {isAuthenticated ? (
              <UserMenuDropdown user={user} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          {/* Sucursal en móvil */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBranchModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{selectedBranch?.name || selectedBranch?.nombre || 'Seleccionar Sucursal'}</span>
            </div>
            <span className="text-xs text-blue-600 font-semibold">Cambiar</span>
          </button>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
