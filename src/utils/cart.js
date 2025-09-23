// simple pure functions for cart logic (easy to test)
export function findItemIndex(cart, productId, selectedSize) {
  return cart.findIndex(c => c.productId === productId && (c.size || "") === (selectedSize || ""));
}

export function addToCart(cart, product, size = "", qty = 1) {
  const itemIndex = findItemIndex(cart, product.id, size);
  if (itemIndex > -1) {
    const newCart = [...cart];
    newCart[itemIndex].qty += qty;
    return newCart;
  }
  return [...cart, {
    productId: product.id,
    title: product.title,
    price: product.price,
    size,
    qty
  }];
}

export function updateQty(cart, productId, size, qty) {
  return cart.map(item =>
    item.productId === productId && (item.size || "") === (size || "")
      ? { ...item, qty: Math.max(1, qty) }
      : item
  );
}

export function removeFromCart(cart, productId, size) {
  return cart.filter(item => !(item.productId === productId && (item.size || "") === (size || "")));
}

export function calculateTotals(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : subtotal === 0 ? 0 : 5.0;
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), shipping, tax, total };
}


