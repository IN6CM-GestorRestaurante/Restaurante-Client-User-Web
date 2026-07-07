import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';

export const AuthLayout = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'Restaurante Gourmet';

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 overflow-x-hidden">
      {/* Columna Izquierda: Ilustración Gastronómica (Oculta en móviles) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800 text-white relative overflow-hidden h-full">
        {/* Círculo de acento de fondo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight">
            {appName}
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            Plataforma Web de Pedidos
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-tight">
            El sabor que amas, al alcance de un clic.
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Explora nuestro catálogo gourmet, reserva la mesa perfecta en tu sucursal favorita o pide en línea para entrega rápida y segura.
          </p>
          <div className="flex items-center gap-4 pt-4 border-t border-white/20 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">✓ Ingredientes Frescos</span>
            <span className="flex items-center gap-1.5 font-medium">✓ Chefs Premiados</span>
            <span className="flex items-center gap-1.5 font-medium">✓ Pago Seguro</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-emerald-200">
          © {new Date().getFullYear()} {appName}. Todos los derechos reservados.
        </div>
      </div>

      {/* Columna Derecha: Contenido del Formulario */}
      <div className="w-full h-full min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-50/80 overflow-y-auto">
        <div className="w-full max-w-[460px] mx-auto my-auto space-y-8 transition-all duration-300">
          
          {/* Volver al inicio */}
          <div className="flex justify-between items-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Catálogo
            </Link>

            {/* Logo móvil */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-800 text-sm">Gourmet</span>
            </div>
          </div>

          {/* Formulario inyectado vía Router */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-300/40 p-8 sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
