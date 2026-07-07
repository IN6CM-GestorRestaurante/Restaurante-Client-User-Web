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
