import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';
import { useBranchStore } from '../../../features/branches/store/branchStore.js';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { selectedBranch } = useBranchStore();
  const appName = selectedBranch?.name || selectedBranch?.nombre || import.meta.env.VITE_APP_NAME || 'Restaurante Gourmet';

  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-8 mt-auto shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-800 text-lg">
                {appName}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Disfruta de la mejor gastronomía en mesa o directo hasta tu puerta. Ingredientes frescos, chefs apasionados y un servicio excepcional.
            </p>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-heading font-semibold text-slate-800 text-sm uppercase tracking-wider mb-3">
              Menú y Servicios
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog" className="hover:text-blue-600 transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/reservations" className="hover:text-blue-600 transition-colors">Reservación de Mesas</Link></li>
              <li><Link to="/orders" className="hover:text-blue-600 transition-colors">Seguimiento de Pedidos</Link></li>
            </ul>
          </div>

          {/* Col 3: Horarios */}
          <div>
            <h4 className="font-heading font-semibold text-slate-800 text-sm uppercase tracking-wider mb-3">
              Horarios de Atención
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  {selectedBranch?.openingTime && selectedBranch?.closingTime
                    ? `Todos los días: ${selectedBranch.openingTime} - ${selectedBranch.closingTime}`
                    : (selectedBranch?.hours || selectedBranch?.horario || 'Lunes a Domingo: 12:00 PM - 11:00 PM')}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h4 className="font-heading font-semibold text-slate-800 text-sm uppercase tracking-wider mb-3">
              Contacto y Ubicación
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{selectedBranch?.address || selectedBranch?.direccion || 'Av. Reforma 10-00, Zona 10, Ciudad de Guatemala'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{selectedBranch?.phoneNumber || selectedBranch?.phone || selectedBranch?.telefono || '+502 2345-6789'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{selectedBranch?.email || 'contacto@restaurantegourmet.com'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {appName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> por el equipo de ingeniería.
          </p>
        </div>
      </div>
    </footer>
  );
};
