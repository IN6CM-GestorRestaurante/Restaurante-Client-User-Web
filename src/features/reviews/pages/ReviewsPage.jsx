import React, { useEffect, useState } from 'react';
import { MessageSquareText, Star, Trash2, Pencil, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReviewStore } from '../store/reviewStore.js';
import { useBranchStore } from '../../branches/store/branchStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { StarRating } from '../components/StarRating.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';
import { formatDate } from '../../../shared/utils/formatters.js';

export const ReviewsPage = () => {
  const { selectedBranch } = useBranchStore();
  const { isAuthenticated } = useAuthStore();
  const {
    reviews,
    averageRating,
    totalReviews,
    myReview,
    loading,
    fetchReviews,
    submitReview,
    editReview,
    removeReview,
  } = useReviewStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const branchId = selectedBranch?._id || selectedBranch?.id;

  useEffect(() => {
    if (branchId) fetchReviews(branchId);
  }, [branchId, fetchReviews]);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [myReview]);

  if (!branchId) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Selecciona una sucursal primero</p>
        <p className="text-xs text-slate-400 mt-1">Elige una sucursal para ver y dejar reseñas.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Selecciona una calificación de al menos 1 estrella');
      return;
    }
    setSubmitting(true);
    try {
      if (myReview) {
        await editReview({ reviewId: myReview._id, branchId, rating, comment });
        toast.success('Reseña actualizada');
        setEditing(false);
      } else {
        await submitReview({ branchId, rating, comment });
        toast.success('¡Gracias por tu reseña!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar tu reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar tu reseña?')) return;
    try {
      await removeReview({ reviewId: myReview._id, branchId });
      toast.success('Reseña eliminada');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar tu reseña');
    }
  };

  const showForm = isAuthenticated && (!myReview || editing);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-slate-800 flex items-center gap-2">
          <MessageSquareText className="w-6 h-6 text-emerald-500" />
          Reseñas de {selectedBranch?.name || selectedBranch?.nombre}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-lg text-slate-800">{averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-xs text-slate-400">
            ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      {isAuthenticated && myReview && !editing && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-xs text-emerald-800 font-medium">Ya dejaste una reseña para esta sucursal.</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="w-3.5 h-3.5" /> Editar
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </Button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-slate-800">
            {myReview ? 'Editar tu reseña' : 'Deja tu reseña'}
          </h3>
          <StarRating value={rating} onChange={setRating} size="lg" />
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos tu experiencia..."
            maxLength={500}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            {editing && (
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            )}
            <Button type="submit" variant="emerald" isLoading={submitting}>
              {myReview ? 'Guardar Cambios' : 'Publicar Reseña'}
            </Button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 font-medium">
          Inicia sesión para dejar tu propia reseña.
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" color="text-emerald-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-sm text-slate-500">
          Todavía no hay reseñas para esta sucursal. ¡Sé el primero!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-800">
                  {review.user?.name
                    ? `${review.user.name} ${review.user.surname || ''}`.trim()
                    : review.user?.username || 'Usuario'}
                </span>
                <span className="text-[11px] text-slate-400">{formatDate(review.createdAt, false)}</span>
              </div>
              <StarRating value={review.rating} readOnly size="sm" />
              {review.comment && <p className="text-sm text-slate-600 mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
