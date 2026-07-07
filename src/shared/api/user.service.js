import { axiosUser } from './api.js';

// 1. Sucursales (Público)
export const getBranchesRequest = async () => {
  return await axiosUser.get('/branches');
};

export const getBranchByIdRequest = async (id) => {
  return await axiosUser.get(`/branches/${id}`);
};

// 2. Menús y Categorías (Público)
export const getMenusRequest = async () => {
  return await axiosUser.get('/menus');
};

export const getCategoriesRequest = async () => {
  return await axiosUser.get('/menus/categories');
};

export const getMenusByBranchRequest = async (branchId) => {
  return await axiosUser.get(`/menus/branch/${branchId}`);
};

export const getMenuByIdRequest = async (id) => {
  return await axiosUser.get(`/menus/${id}`);
};

// 3. Perfil del Usuario y Direcciones (Protegido)
export const getMyProfileRequest = async () => {
  return await axiosUser.get('/users/profile');
};

export const updateMyProfileRequest = async (data) => {
  return await axiosUser.put('/users/profile', data);
};

export const uploadAvatarRequest = async (formData) => {
  return await axiosUser.post('/users/profile/avatar', formData);
};

export const addAddressRequest = async (data) => {
  return await axiosUser.post('/users/profile/addresses', data);
};

export const removeAddressRequest = async (id) => {
  return await axiosUser.delete(`/users/profile/addresses/${id}`);
};

export const setDefaultAddressRequest = async (id) => {
  return await axiosUser.patch(`/users/profile/addresses/${id}/default`);
};

// 4. Reservaciones de Mesa (Protegido)
export const checkAvailabilityRequest = async (params) => {
  return await axiosUser.get('/reservations/availability', { params });
};

export const getMyReservationsRequest = async () => {
  return await axiosUser.get('/reservations/me/history');
};

export const createReservationRequest = async (data) => {
  return await axiosUser.post('/reservations', data);
};

export const cancelReservationRequest = async (id) => {
  return await axiosUser.put(`/reservations/${id}/cancel`);
};

// 5. Pedidos (Protegido)
export const getMyOrdersRequest = async (params) => {
  return await axiosUser.get('/orders/me/history', { params });
};

export const getOrderDetailsRequest = async (id) => {
  return await axiosUser.get(`/orders/${id}`);
};

export const createOrderRequest = async (data) => {
  return await axiosUser.post('/orders', data);
};

export const cancelOrderRequest = async (id) => {
  return await axiosUser.put(`/orders/${id}/cancel`);
};

// 6. Reseñas y calificaciones
export const getReviewsByBranchRequest = async (branchId, params) => {
  return await axiosUser.get(`/reviews/branch/${branchId}`, { params });
};

export const getMyReviewsRequest = async () => {
  return await axiosUser.get('/reviews/me');
};

export const createReviewRequest = async (data) => {
  return await axiosUser.post('/reviews', data);
};

export const updateReviewRequest = async (id, data) => {
  return await axiosUser.put(`/reviews/${id}`, data);
};

export const deleteReviewRequest = async (id) => {
  return await axiosUser.delete(`/reviews/${id}`);
};
