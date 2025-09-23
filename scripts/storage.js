// storage.js - minimal cart API using localStorage
const KEY = 'mogox_cart_v1';

export function loadCart(){
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadCart', e);
    return [];
  }
}

export function saveCart(items){
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    // dispatch storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('saveCart', e);
  }
}

export function addToCart(item){
  const items = loadCart();
  const idx = items.findIndex(i => i.productId === item.productId && i.size === item.size);
  if(idx > -1) {
    items[idx].qty = items[idx].qty + item.qty;
  } else {
    items.push(item);
  }
  saveCart(items);
  return items;
}

export function updateQty(productId, size, qty){
  const items = loadCart().map(i => (i.productId === productId && i.size === size) ? {...i, qty } : i);
  saveCart(items);
  return items;
}

export function removeItem(productId, size){
  const items = loadCart().filter(i => !(i.productId === productId && i.size === size));
  saveCart(items);
  return items;
}

export function clearCart(){
  saveCart([]);
}
