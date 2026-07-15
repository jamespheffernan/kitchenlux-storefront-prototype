import { API_URL } from '../api';

function normalizeImageName(value, fallback = 'kitchenware') {
  const normalized = String(value || '')
    .replace(/^\/images\//, '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return normalized || fallback;
}

export const getProductImageUrl = (productSlug) =>
  `${API_URL}/images/direct/${normalizeImageName(productSlug, 'product')}`;

export const getHeroImageUrl = (imageName) =>
  `${API_URL}/images/direct/${normalizeImageName(imageName, 'kitchen')}`;

export const getFallbackImageUrl = (category = 'kitchen') =>
  `${API_URL}/images/direct/${normalizeImageName(category, 'kitchen')}`;

export const getContentImageUrl = (imageName) =>
  `${API_URL}/images/direct/${normalizeImageName(imageName, 'content')}`;

export const createImageErrorHandler = (category = 'kitchen') => (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = getFallbackImageUrl(category);
};

export const createContentImageErrorHandler = (imageName = 'content') => (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = getContentImageUrl(imageName);
};

export { normalizeImageName };
