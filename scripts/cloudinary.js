// cloudinary.js - tiny helper to serve images/videos via Cloudinary
// Configure your cloud name here or via window.MOGOX_CLOUDINARY_CLOUD at runtime
export const CLOUDINARY_CLOUD = window.MOGOX_CLOUDINARY_CLOUD || '';

function buildTransform({ width, height, crop, quality = 'q_auto', format = 'f_auto' } = {}){
  const parts = [format, quality];
  if (width) parts.push('w_' + width);
  if (height) parts.push('h_' + height);
  if (crop || (width && height)) parts.push('c_' + (crop || 'fill'));
  return parts.join(',');
}

export function buildImageUrl(src, opts = {}){
  if (!CLOUDINARY_CLOUD || !src) return src;
  const t = buildTransform(opts);
  // Use fetch to proxy remote images through Cloudinary for consistent quality and format
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/${t}/${encodeURIComponent(src)}`;
}

export function buildThumbUrl(src){
  return buildImageUrl(src, { width: 64, height: 64 });
}

export function buildCardUrl(src){
  return buildImageUrl(src, { width: 800, height: 600 });
}

// Optional: build video URL if using Cloudinary public IDs or fetch (plan dependent)
export function buildVideoUrl(src, opts = {}){
  if (!CLOUDINARY_CLOUD || !src) return src;
  const t = buildTransform(opts);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/fetch/${t}/${encodeURIComponent(src)}`;
}
