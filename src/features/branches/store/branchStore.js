import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getBranchesRequest } from '../../../shared/api/user.service.js';

export const useBranchStore = create(
  persist(
    (set, get) => ({
      selectedBranch: null,
      branches: [],
      loading: false,
      error: null,

      setSelectedBranch: (branch) => {
        set({ selectedBranch: branch });
      },

      fetchBranches: async () => {
        try {
          set({ loading: true, error: null });
          const res = await getBranchesRequest();
          const list = res.data?.data || res.data || [];
          set({ branches: Array.isArray(list) ? list : [] });
          
          // Si no hay sucursal seleccionada, preseleccionar la primera por defecto
          if (!get().selectedBranch && Array.isArray(list) && list.length > 0) {
            set({ selectedBranch: list[0] });
          }
          return list;
        } catch (error) {
          console.error('Error fetching branches:', error);
          set({ error: error.message || 'Error al obtener sucursales' });
          return [];
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'restaurant-user-branch-storage',
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);
