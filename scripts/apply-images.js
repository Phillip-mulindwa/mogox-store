// apply-images.js - apply data/images.json to products at runtime
import { PRODUCTS } from './products.js';
import { buildCardUrl } from './cloudinary.js';

export async function getProductsWithResolvedImages(){
  try {
    const res = await fetch('data/images.json', { cache: 'no-store' });
    if(!res.ok) return PRODUCTS;
    const map = await res.json();
    return PRODUCTS.map(p => {
      const mapped = Array.isArray(map[p.id]) ? map[p.id] : null;
      if(mapped && mapped.length){
        return { ...p, images: mapped };
      }
      return p;
    });
  } catch (e) {
    return PRODUCTS;
  }
}

