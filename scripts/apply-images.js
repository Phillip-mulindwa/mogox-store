// apply-images.js - apply data/images.json to products at runtime
import { PRODUCTS } from './products.js';
import { buildCardUrl } from './cloudinary.js';

async function fetchJson(url){
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function getProductsWithResolvedImages(){
  try {
    const manual = await fetchJson('data/manual-images.json');
    const autoMap = await fetchJson('data/images.json');
    if(!manual && !autoMap) return PRODUCTS;
    return PRODUCTS.map(p => {
      const m = manual && manual[p.id];
      const a = autoMap && autoMap[p.id];
      const imgs = (m && m.length ? m : (a && a.length ? a : p.images)) || p.images;
      return { ...p, images: imgs };
    });
  } catch (e) {
    return PRODUCTS;
  }
}

