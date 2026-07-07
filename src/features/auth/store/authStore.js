import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest } from '../../../shared/api/auth.service.js';
import { getMyProfileRequest } from '../../../shared/api/user.service.js';

const VALID_CLIENT_ROLES = ['CLIENT', 'USER', 'WAITER', 'ADMIN', 'SUPER_ADMIN'];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoading: true,
      isAuthenticated: false,

      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;

        if (!token || (role && !VALID_CLIENT_ROLES.includes(role))) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: !token ? null : 'No tienes permiso para acceder a esta plataforma web',
          });
        } else {
          set({ isLoading: false, isAuthenticated: true });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: { ...state.user, ...updatedUser },
        }));
      },

      fetchEnrichedProfile: async () => {
        try {
          const res = await getMyProfileRequest();
          if (res.data?.success && res.data?.data) {
            set((state) => ({
              user: { ...state.user, ...res.data.data },
            }));
          }
        } catch (error) {
          console.error('Error fetching enriched user profile:', error);
        }
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });

          const role = data?.userDetails?.role || 'CLIENT';
          if (!VALID_CLIENT_ROLES.includes(role)) {
            const message = 'Rol no autorizado para el cliente web.';
            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: false,
              loading: false,
              error: message,
            });
            return { success: false, error: message };
          }

          set({
            user: data.userDetails,
            token: data.accessToken || data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresIn || data.expiresAt,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          // Obtener perfil enriquecido de ServerUser en background
          get().fetchEnrichedProfile();

          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || 'Error al iniciar sesión';
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'restaurant-user-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
