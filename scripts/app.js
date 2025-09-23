import { PRODUCTS } from './products.js';
import * as STORE from './storage.js';

const $app = document.getElementById('app');
const $navCart = document.getElementById('nav-cart');
const YEAR = document.getElementById('year');
YEAR.textContent = new Date().getFullYear();

function formatCurrency(v){ return '€' + Number(v).toFixed(2); }

function updateCartCount(){
  const items = STORE.loadCart();
  const count = items.reduce((s,i)=> s + i.qty, 0);
  $navCart.textContent = `Cart (${count})`;
}

// ROUTING: simple hash router
function router(){
  const hash = location.hash || '#/';
  const [_, path, id] = hash.split('/');
  if(hash === '#/' || hash === '') renderHome();
  else if(path === 'product') renderProduct(id);
  else if(path === 'cart') renderCart();
  else if(path === 'checkout') renderCheckout();
  else if(path === 'confirmation') renderConfirmation();
  else renderHome();
}

// ---------- RENDER: HOME ----------
function renderHome(){
  document.title = 'Mogox — Home';
  $app.innerHTML = `
    <section class="hero" aria-labelledby="main-title">
      <h1 id="main-title">Mogox — Modern clothing</h1>
      <p>Quality pieces for everyday wear. Search, view details, add to cart and checkout (simulation).</p>
      <div style="margin-top:12px;">
        <input id="search" class="input" type="search" placeholder="Search products..." aria-label="Search products" />
      </div>
    </section>

    <section>
      <h2>Featured products</h2>
      <div id="grid" class="grid" role="list" aria-live="polite"></div>
    </section>
  `;

  const $grid = document.getElementById('grid');
  const $search = document.getElementById('search');
  function show(list){
    $grid.innerHTML = '';
    list.forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0;font-size:1rem">${p.title}</h3>
            <div class="price">${formatCurrency(p.price)}</div>
          </div>
          <div class="row" style="margin-top:6px">
            <a class="btn btn-ghost" href="#/product/${p.id}">View</a>
            <button class="btn btn-primary" data-add="${p.id}">Add</button>
          </div>
        </div>
      `;
      $grid.appendChild(el);
    });
  }

  show(PRODUCTS);

  $grid.addEventListener('click', (e)=>{
    const id = e.target.closest('[data-add]')?.getAttribute('data-add');
    if(id){
      const prod = PRODUCTS.find(p => p.id === id);
      // default size to first
      STORE.addToCart({ productId: prod.id, title: prod.title, price: prod.price, size: prod.sizes[0] || 'One size', qty: 1, image: prod.images[0] });
      updateCartCount();
      alert('Added to cart: ' + prod.title);
    }
  });

  $search.addEventListener('input', (e)=> {
    const q = e.target.value.trim().toLowerCase();
    show(PRODUCTS.filter(p => p.title.toLowerCase().includes(q)));
  });
  updateCartCount();
  $app.focus();
}

// ---------- RENDER: PRODUCT ----------
function renderProduct(id){
  const product = PRODUCTS.find(p => p.id === id);
  if(!product){ location.hash = '#/'; return; }
  document.title = product.title + ' — Mogox';
  // thumbnails + main image carousel (simple)
  $app.innerHTML = `
    <div class="product-grid">
      <div>
        <div id="main-image" style="border-radius:10px;overflow:hidden">
          <img src="${product.images[0]}" alt="${product.title}" style="width:100%;height:420px;object-fit:cover" />
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          ${product.images.map((img, i)=> `<button class="thumb" data-i="${i}" style="border:1px solid #eee;padding:4px;border-radius:8px"><img src="${img}" alt="${product.title} thumb ${i+1}" style="width:64px;height:64px;object-fit:cover;border-radius:6px"></button>`).join('')}
        </div>
      </div>

      <div>
        <h1>${product.title}</h1>
        <div class="muted">${formatCurrency(product.price)}</div>
        <p style="margin-top:10px">${product.description}</p>

        <label for="size-select">Size</label>
        <select id="size-select" class="input" aria-label="Select size">
          ${product.sizes.map(s=>`<option value="${s}">${s}</option>`).join('')}
        </select>

        <div style="margin-top:12px;" class="row">
          <label for="qty">Qty</label>
          <input id="qty" class="input qty-input" type="number" min="1" value="1" aria-label="Quantity" />
        </div>

        <div style="margin-top:12px" class="row">
          <button id="add-cart" class="btn btn-primary">Add to cart</button>
          <a class="btn btn-ghost" href="#/cart">View cart</a>
        </div>
      </div>
    </div>
  `;

  $app.querySelectorAll('.thumb').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = Number(btn.getAttribute('data-i'));
      const imgEl = document.querySelector('#main-image img');
      imgEl.src = product.images[i];
      imgEl.alt = product.title + ' image ' + (i+1);
      imgEl.focus();
    });
  });

  document.getElementById('add-cart').addEventListener('click', ()=>{
    const size = document.getElementById('size-select').value || (product.sizes[0] || 'One size');
    const qty = Math.max(1, Number(document.getElementById('qty').value) || 1);
    STORE.addToCart({ productId: product.id, title: product.title, price: product.price, size, qty, image: product.images[0] });
    updateCartCount();
    location.hash = '#/cart';
  });

  updateCartCount();
  $app.focus();
}

// ---------- RENDER: CART ----------
function renderCart(){
  document.title = 'Cart — Mogox';
  const items = STORE.loadCart();
  $app.innerHTML = `
    <h1>Your cart</h1>
    <div id="cart-area"></div>
  `;
  const $area = document.getElementById('cart-area');

  if(items.length === 0){
    $area.innerHTML = `<p>Cart is empty. <a href="#/">Continue shopping</a></p>`;
    updateCartCount();
    $app.focus();
    return;
  }

  function subtotal(){ return items.reduce((s,i)=> s + i.price * i.qty, 0); }
  function renderSummary(){
    $area.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 320px;gap:16px">
        <div id="items-list"></div>
        <aside style="background:#fff;padding:16px;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.04)">
          <div style="margin-bottom:10px">Order summary</div>
          <div style="display:flex;justify-content:space-between"><div>Subtotal</div><div>${formatCurrency(subtotal())}</div></div>
          <div style="display:flex;justify-content:space-between"><div>Shipping</div><div>${formatCurrency(5)}</div></div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-weight:700"><div>Total</div><div>${formatCurrency(subtotal() + 5)}</div></div>
          <div style="margin-top:12px">
            <a class="btn btn-primary" href="#/checkout">Proceed to checkout</a>
          </div>
        </aside>
      </div>
    `;
    const $list = document.getElementById('items-list');
    $list.innerHTML = items.map(it => `
      <div style="display:flex;gap:12px;align-items:center;background:#fff;padding:10px;border-radius:8px;margin-bottom:10px">
        <img src="${it.image}" alt="${it.title}" style="width:80px;height:80px;object-fit:cover;border-radius:6px" />
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between"><strong>${it.title}</strong><div>${formatCurrency(it.price)}</div></div>
          <div class="muted">Size: ${it.size}</div>
          <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
            <input type="number" aria-label="Qty ${it.title}" class="input qty-input" data-q="${it.productId}||${it.size}" value="${it.qty}" min="1" />
            <button class="btn btn-ghost" data-remove="${it.productId}||${it.size}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    // events
    $list.querySelectorAll('[data-q]').forEach(inp=>{
      inp.addEventListener('change', (e)=>{
        const [pid, size] = e.target.getAttribute('data-q').split('||');
        const q = Math.max(1, Number(e.target.value) || 1);
        STORE.updateQty(pid, size, q);
        items.splice(0, items.length, ...STORE.loadCart()); // refresh items array
        renderSummary();
        updateCartCount();
      });
    });

    $list.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const [pid, size] = btn.getAttribute('data-remove').split('||');
        STORE.removeItem(pid, size);
        items.splice(0, items.length, ...STORE.loadCart());
        renderSummary();
        updateCartCount();
      });
    });
  }

  renderSummary();
  $app.focus();
}

// ---------- RENDER: CHECKOUT ----------
function renderCheckout(){
  const items = STORE.loadCart();
  if(items.length === 0){ location.hash = '#/cart'; return; }
  function subtotal(){ return items.reduce((s,i)=> s + i.price * i.qty, 0); }
  $app.innerHTML = `
    <h1>Checkout</h1>
    <form id="checkout-form" style="max-width:640px;background:#fff;padding:16px;border-radius:10px">
      <label>Full name *</label>
      <input id="name" class="input" required />
      <label style="margin-top:8px">Email</label>
      <input id="email" class="input" type="email" />
      <label style="margin-top:8px">Address *</label>
      <textarea id="address" class="input" required></textarea>
      <label style="margin-top:8px">Shipping</label>
      <select id="shipping" class="input">
        <option value="standard">Standard (2-5 days)</option>
        <option value="express">Express (1-2 days)</option>
      </select>
      <div style="margin-top:12px;display:flex;justify-content:space-between">
        <div>Order total</div><div>${formatCurrency(subtotal() + 5)}</div>
      </div>
      <div style="margin-top:12px">
        <button class="btn btn-primary" type="submit">Place order (simulate)</button>
      </div>
    </form>
  `;

  document.getElementById('checkout-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    if(!name || !address) return alert('Please fill required fields');
    const orderId = 'MOGOX-' + Math.random().toString(36).slice(2,9).toUpperCase();
    const total = subtotal() + 5;
    // clear cart
    STORE.clearCart();
    updateCartCount();
    // store order details in sessionStorage for confirmation page (simple)
    sessionStorage.setItem('lastOrder', JSON.stringify({ orderId, name, total }));
    location.hash = '#/confirmation';
  });

  $app.focus();
}

// ---------- RENDER: CONFIRMATION ----------
function renderConfirmation(){
  const order = JSON.parse(sessionStorage.getItem('lastOrder') || 'null');
  if(!order){ location.hash = '#/'; return; }
  document.title = 'Order Confirmed — Mogox';
  $app.innerHTML = `
    <div style="max-width:720px;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.04)">
      <h1>Thank you, ${order.name}!</h1>
      <p>Your order <strong>${order.orderId}</strong> was received.</p>
      <p>Total: <strong>${formatCurrency(order.total)}</strong></p>
      <a href="#/" class="btn btn-ghost">Continue shopping</a>
    </div>
  `;
  sessionStorage.removeItem('lastOrder');
  $app.focus();
}

// update on load and hashchange
window.addEventListener('hashchange', router);
window.addEventListener('load', ()=>{
  updateCartCount();
  router();
});
