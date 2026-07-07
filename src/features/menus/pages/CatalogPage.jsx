import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { useBranchStore } from '../../branches/store/branchStore.js';
import { getMenusRequest, getCategoriesRequest, getMenusByBranchRequest } from '../../../shared/api/user.service.js';
import { CategoryTabs } from '../components/CategoryTabs.jsx';
import { MenuGrid } from '../components/MenuGrid.jsx';
import { MenuItemDetailModal } from '../components/MenuItemDetailModal.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { useOutletContext } from 'react-router-dom';

export const CatalogPage = () => {
  const { selectedBranch } = useBranchStore();
  const context = useOutletContext();
  const openBranchModal = context?.openBranchModal;

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      // 1. Obtener Categorías
      const catRes = await getCategoriesRequest().catch(() => ({ data: [] }));
      const catList = catRes.data?.data || catRes.data || [];
      setCategories(Array.isArray(catList) ? catList : []);

      // 2. Obtener Menús según sucursal activa
      let menuList = [];
      const branchId = selectedBranch?._id || selectedBranch?.id;
      if (branchId) {
        const menuRes = await getMenusByBranchRequest(branchId).catch(() => null);
        menuList = menuRes?.data?.data || menuRes?.data || [];
      } else {
        // Fallback seguro a todos los menús si por alguna razón no hay sucursal seleccionada
        const menuRes = await getMenusRequest().catch(() => ({ data: [] }));
        menuList = menuRes?.data?.data || menuRes?.data || [];
      }
      
      setMenus(Array.isArray(menuList) ? menuList : []);
    } catch (error) {
      console.error('Error fetching catalog data:', error);
      setMenus([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, [selectedBranch]);

  // Filtrado optimizado en memoria
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      // Filtrar por categoría
      if (activeCategory !== 'ALL') {
        const itemCat = item.category?.name || item.category?._id || item.category || '';
        const activeCatObj = categories.find((c) => (c._id || c.id || c.name) === activeCategory);
        const targetName = activeCatObj?.name || activeCategory;
        if (itemCat !== targetName && itemCat !== activeCategory) {
          return false;
        }
      }
      // Filtrar por búsqueda
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const nameMatch = (item.name || item.nombre || '').toLowerCase().includes(query);
        const descMatch = (item.description || item.descripcion || '').toLowerCase().includes(query);
        return nameMatch || descMatch;
      }
      return true;
    });
  }, [menus, activeCategory, searchQuery, categories]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Banner / Header Gastronómico */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-blue-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/15">
              <Sparkles className="w-3.5 h-3.5" /> Alta Cocina Contemporánea
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Catálogo Gastronómico
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Selecciona tus platillos artesanales favoritos. Diseñados para deleitar tu paladar con ingredientes locales e importados de la más alta calidad.
            </p>
          </div>

          {/* Sucursal actual y botón cambiar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-start sm:items-end shrink-0">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Sucursal Activa
            </span>
            <span className="font-heading font-extrabold text-base sm:text-lg text-white mt-0.5">
              {selectedBranch?.name || selectedBranch?.nombre || 'Sucursal Central'}
            </span>
            <button
              onClick={openBranchModal}
              className="mt-2 text-xs font-bold text-blue-300 hover:text-white underline transition-colors"
            >
              Cambiar de ubicación →
            </button>
          </div>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar por nombre o ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="!bg-slate-50"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-500" /> Categorías:
          </span>
          <button
            onClick={fetchCatalogData}
            title="Actualizar menú"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs de Categorías */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setSearchQuery('');
        }}
      />

      {/* Grid de Platillos */}
      <MenuGrid
        items={filteredMenus}
        isLoading={loading}
        onOpenDetail={(item) => setSelectedItemForDetail(item)}
      />

      {/* Modal de Detalle de Platillo */}
      <MenuItemDetailModal
        isOpen={Boolean(selectedItemForDetail)}
        onClose={() => setSelectedItemForDetail(null)}
        item={selectedItemForDetail}
      />

    </div>
  );
};
