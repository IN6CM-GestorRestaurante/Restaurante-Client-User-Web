import { create } from 'zustand';
import {
  getReviewsByBranchRequest,
  getMyReviewsRequest,
  createReviewRequest,
  updateReviewRequest,
  deleteReviewRequest,
} from '../../../shared/api/user.service.js';

export const useReviewStore = create((set, get) => ({
  reviews: [],
  averageRating: 0,
  totalReviews: 0,
  myReview: null,
  loading: false,
  error: null,

  fetchReviews: async (branchId) => {
    if (!branchId) return;
    try {
      set({ loading: true, error: null });
      const [{ data }, myReview] = await Promise.all([
        getReviewsByBranchRequest(branchId),
        get().fetchMyReviewForBranch(branchId),
      ]);
      set({
        reviews: data?.reviews || [],
        averageRating: data?.averageRating || 0,
        totalReviews: data?.totalReviews || 0,
        myReview,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener las reseñas' });
    } finally {
      set({ loading: false });
    }
  },

  // No requiere auth para ver reseñas publicas, pero si para saber cual es "la mia".
  // Si el usuario no esta autenticado esta llamada simplemente falla y se ignora.
  fetchMyReviewForBranch: async (branchId) => {
    try {
      const { data } = await getMyReviewsRequest();
      const mine = (data?.data || []).find(
        (r) => (r.restaurant?._id || r.restaurant) === branchId
      );
      return mine || null;
    } catch {
      return null;
    }
  },

  submitReview: async ({ branchId, rating, comment }) => {
    await createReviewRequest({ restaurant: branchId, rating, comment });
    await get().fetchReviews(branchId);
  },

  editReview: async ({ reviewId, branchId, rating, comment }) => {
    await updateReviewRequest(reviewId, { rating, comment });
    await get().fetchReviews(branchId);
  },

  removeReview: async ({ reviewId, branchId }) => {
    await deleteReviewRequest(reviewId);
    await get().fetchReviews(branchId);
  },
}));
