/**
 * Formatea un número o string numérico a formato de moneda guatemalteca (Quetzales - Q / GTQ).
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return `Q ${formatted}`;
};

/**
 * Formatea una fecha ISO a texto legible en español.
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
    };
    return new Intl.DateTimeFormat('es-GT', options).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Retorna la URL completa para una imagen estática o de Cloudinary si es una ruta relativa.
 */
export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '/assets/illustrations/placeholder-food.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:image')) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL || '';
  if (baseUrl && !imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  return imagePath;
};

/**
 * Calcula la promoción vigente de un platillo (si la tiene) y su precio con descuento.
 * Soporta los discountType configurados desde el panel de administración.
 */
export const getActivePromotion = (item) => {
  const promotion = item?.promotion;
  if (!promotion?.isActive) return null;

  const now = new Date();
  if (promotion.startsAt && now < new Date(promotion.startsAt)) return null;
  if (promotion.endsAt && now > new Date(promotion.endsAt)) return null;

  const price = Number(item.price) || 0;
  const value = Number(promotion.discountValue) || 0;
  let discountedPrice = price;
  let label = '';

  switch (promotion.discountType) {
    case 'PERCENTAGE':
    case 'PORCENTAJE':
      discountedPrice = price - (price * value) / 100;
      label = `-${value}%`;
      break;
    case 'FIXED_PRICE':
      discountedPrice = value;
      label = 'Precio especial';
      break;
    case 'FIXED':
    case 'FIJO':
      discountedPrice = price - value;
      label = `-${formatCurrency(value)}`;
      break;
    default:
      return null;
  }

  discountedPrice = Math.max(0, discountedPrice);
  if (discountedPrice >= price) return null;

  return { discountedPrice, originalPrice: price, label };
};
