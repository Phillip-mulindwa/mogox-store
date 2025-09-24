import { PRODUCTS } from './products.js';
import * as STORE from './storage.js';

const $app = document.getElementById('app');
const $navCart = document.getElementById('nav-cart');
const $miniCart = document.getElementById('mini-cart');
const $miniCartWrap = document.querySelector('[data-minicart]');
const $dropdown = document.querySelector('[data-dropdown]');
const YEAR = document.getElementById('year');
YEAR.textContent = new Date().getFullYear();

function formatCurrency(v){ return '€' + Number(v).toFixed(2); }

// Image fallbacks by category to ensure reliable, relevant visuals
const FALLBACKS = Object.freeze({
  tops: 'https://images.unsplash.com/photo-1520974735194-9759a5a0bd05?w=1200&q=80&auto=format&fit=crop',
  outerwear: 'https://images.unsplash.com/photo-1620799139504-8a50f19495c1?w=1200&q=80&auto=format&fit=crop',
  bottoms: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=1200&q=80&auto=format&fit=crop',
  dresses: 'https://images.unsplash.com/photo-1520975825333-72b288f3e8e0?w=1200&q=80&auto=format&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=1200&q=80&auto=format&fit=crop'
});
const GENERIC_FALLBACK = 'https://images.unsplash.com/photo-1520974735194-9759a5a0bd05?w=1200&q=80&auto=format&fit=crop';
function getFallbackFor(product){
  return FALLBACKS[product.category] || GENERIC_FALLBACK;
}

function updateCartCount(){
  const items = STORE.loadCart();
  const count = items.reduce((s,i)=> s + i.qty, 0);
  $navCart.textContent = `Cart (${count})`;
  renderMiniCart(items);
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
  else if(path === 'women') renderCollection({ gender: 'women', title: "Women's Collection" });
  else if(path === 'men') renderCollection({ gender: 'men', title: "Men's Collection" });
  else if(path === 'new') renderCollection({ isNew: true, title: 'New Arrivals' });
  else if(path === 'clearance') renderCollection({ clearance: true, title: 'Clearance' });
  else if(path === 'about') renderAbout();
  else if(path === 'login') renderLogin();
  else renderHome();
}

// ---------- RENDER: HOME ----------
function renderHome(){
  document.title = 'Mogox — Home';
  $app.innerHTML = `
    <section class="hero" aria-labelledby="main-title">
      <h1 id="main-title">Mogox — Modern clothing</h1>
      <p>Quality pieces for everyday wear. Search, filter, add to cart and checkout.</p>
      <div class="filters">
        <button class="pill" data-filter="all" aria-pressed="true">All</button>
        <button class="pill" data-filter="women">Women</button>
        <button class="pill" data-filter="men">Men</button>
        <button class="pill" data-filter="new">New</button>
        <button class="pill" data-filter="accessories">Accessories</button>
      </div>
      <div style="margin-top:12px;max-width:520px;margin-left:auto;margin-right:auto;">
        <input id="search" class="input" type="search" placeholder="Search products..." aria-label="Search products" />
      </div>
    </section>

    <section class="tiles">
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
        <a class="tile" href="#/women" aria-label="Shop Women">
          <img src="https://images.unsplash.com/photo-1519741503755-06f3d4803bfc?w=1200&q=80&auto=format&fit=crop" alt="Women collection"/>
          <span>Women</span>
        </a>
        <a class="tile" href="#/men" aria-label="Shop Men">
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop" alt="Men collection"/>
          <span>Men</span>
        </a>
        <a class="tile" href="#/new" aria-label="Shop New Arrivals">
          <img src="https://images.unsplash.com/photo-1520975825333-72b288f3e8e0?w=1200&q=80&auto=format&fit=crop" alt="New arrivals"/>
          <span>New</span>
        </a>
        <a class="tile" href="#/clearance" aria-label="Shop Clearance">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop" alt="Clearance"/>
          <span>Clearance</span>
        </a>
      </div>
    </section>

    <section class="usps">
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
        <div class="card" style="padding:12px"><strong>Free returns</strong><p class="muted">30-day hassle-free.</p></div>
        <div class="card" style="padding:12px"><strong>Quality materials</strong><p class="muted">Built to last.</p></div>
        <div class="card" style="padding:12px"><strong>Secure checkout</strong><p class="muted">Encrypted & private.</p></div>
        <div class="card" style="padding:12px"><strong>Fast shipping</strong><p class="muted">2-5 business days.</p></div>
      </div>
    </section>

    <section>
      <h2 style="text-align:center">Featured products</h2>
      <div class="catalogue"><div id="grid" class="grid" role="list" aria-live="polite"></div></div>
    </section>
  `;

  const $grid = document.getElementById('grid');
  const $search = document.getElementById('search');
  function show(list){
    $grid.innerHTML = '';
    list.forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      const fallback = getFallbackFor(p);
      const hasAlt = Boolean(p.images[1] && p.images[1] !== p.images[0]);
      el.innerHTML = `
        <div class="card-media">
          <img class="primary" src="${p.images[0]}" alt="${p.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback}'" />
          ${hasAlt ? `<img class="alt" src="${p.images[1]}" alt="${p.title} alternate" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">` : ''}
          <div class="card-overlay">
            <div class="row" style="gap:8px">
              <a class="btn btn-ghost" href="#/product/${p.id}">Quick View</a>
              <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin:0;font-size:1rem">${p.title}</h3>
            <div class="price">${formatCurrency(p.price)}${p.compareAt ? `<span class=\"compare\">${formatCurrency(p.compareAt)}</span>` : ''}</div>
          </div>
          ${p.clearance ? (()=>{ const pct = p.compareAt ? Math.max(1, Math.round(100 - (p.price/p.compareAt*100))) : 0; return `<div class=\"badge badge-clearance\" aria-label=\"Clearance\">Clearance • ${pct}% off</div>`; })() : ''}
        </div>
      `;
      $grid.appendChild(el);
    });
  }

  let activeFilter = 'all';
  let list = PRODUCTS.slice();
  show(list);

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
    const base = filterList(PRODUCTS, activeFilter);
    show(base.filter(p => p.title.toLowerCase().includes(q)));
  });
  // filter buttons
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pill').forEach(b=> b.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      activeFilter = btn.getAttribute('data-filter');
      const q = $search.value.trim().toLowerCase();
      const base = filterList(PRODUCTS, activeFilter);
      show(q ? base.filter(p=> p.title.toLowerCase().includes(q)) : base);
    });
  });
  updateCartCount();
  $app.focus();
}

function filterList(products, filter){
  if(filter === 'women') return products.filter(p => p.gender === 'women');
  if(filter === 'men') return products.filter(p => p.gender === 'men');
  if(filter === 'new') return products.filter(p => p.isNew);
  if(filter === 'accessories') return products.filter(p => p.category === 'accessories');
  return products;
}

// ---------- RENDER: PRODUCT ----------
function renderProduct(id){
  const product = PRODUCTS.find(p => p.id === id);
  if(!product){ location.hash = '#/'; return; }
  document.title = product.title + ' — Mogox';
  // thumbnails + main image carousel (simple)
  const fallback = getFallbackFor(product);
  const gallery = Array.from(new Set([product.images[0], product.images[1], fallback].filter(Boolean)));
  $app.innerHTML = `
    <div class="product-grid">
      <div>
        <div id="main-image" style="border-radius:10px;overflow:hidden">
          <img src="${product.images[0]}" alt="${product.title}" style="width:100%;height:420px;object-fit:cover" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback}'" />
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          ${gallery.map((img, i)=> `<button class="thumb" data-i="${i}" style="border:1px solid #eee;padding:4px;border-radius:8px"><img src="${img}" alt="${product.title} thumb ${i+1}" style="width:64px;height:64px;object-fit:cover;border-radius:6px" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback}'"></button>`).join('')}
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
      imgEl.src = gallery[i] || product.images[0] || fallback;
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
        <img src="${it.image}" alt="${it.title}" style="width:80px;height:80px;object-fit:cover;border-radius:6px" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${GENERIC_FALLBACK}'" />
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

// ---------- RENDER: COLLECTION ROUTES ----------
function renderCollection({ gender, isNew, title }){
  document.title = title + ' — Mogox';
  const filtered = PRODUCTS.filter(p =>
    (gender ? p.gender === gender : true) &&
    (isNew ? p.isNew : true) &&
    (title === 'Clearance' ? p.clearance : true)
  );
  $app.innerHTML = `
    <section class="hero" aria-labelledby="col-title">
      <h1 id="col-title">${title}</h1>
      <p>${filtered.length} items</p>
      ${title === 'Clearance' ? `<div class="muted" style="max-width:700px;margin:6px auto 0">Clearance means final markdowns — last sizes, limited quantities, and the best prices before items leave our catalogue. Once they're gone, they're gone.</div>` : ''}
    </section>
    <section>
      <h2 style="text-align:center">Browse</h2>
      <div class="catalogue"><div id="grid" class="grid" role="list" aria-live="polite"></div></div>
    </section>
  `;
  const $grid = document.getElementById('grid');
  $grid.innerHTML = filtered.map(p => {
    const fallback = getFallbackFor(p);
    const hasAlt = Boolean(p.images[1] && p.images[1] !== p.images[0]);
    return `
    <article class="card">
      <div class="card-media">
        <img class="primary" src="${p.images[0]}" alt="${p.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback}'" />
        ${hasAlt ? `<img class=\"alt\" src=\"${p.images[1]}\" alt=\"${p.title} alternate\" loading=\"lazy\" referrerpolicy=\"no-referrer\" onerror=\"this.style.display='none'\">` : ''}
        <div class="card-overlay">
          <div class="row" style="gap:8px">
            <a class="btn btn-ghost" href="#/product/${p.id}">Quick View</a>
            <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3 style="margin:0;font-size:1rem">${p.title}</h3>
          <div class="price">${formatCurrency(p.price)}${p.compareAt ? `<span class=\"compare\">${formatCurrency(p.compareAt)}</span>` : ''}</div>
        </div>
        ${p.clearance ? (()=>{ const pct = p.compareAt ? Math.max(1, Math.round(100 - (p.price/p.compareAt*100))) : 0; return `<div class=\"badge badge-clearance\" aria-label=\"Clearance\">Clearance • ${pct}% off</div>`; })() : ''}
      </div>
    </article>`;
  }).join('');
  $grid.addEventListener('click', (e)=>{
    const id = e.target.closest('[data-add]')?.getAttribute('data-add');
    if(id){
      const prod = PRODUCTS.find(p => p.id === id);
      STORE.addToCart({ productId: prod.id, title: prod.title, price: prod.price, size: prod.sizes[0] || 'One size', qty: 1, image: prod.images[0] });
      updateCartCount();
      alert('Added to cart: ' + prod.title);
    }
  });
  updateCartCount();
  $app.focus();
}

function renderAbout(){
  document.title = 'About — Mogox';
  $app.innerHTML = `
    <section class="hero" aria-labelledby="about-title">
      <h1 id="about-title">About Mogox</h1>
      <p>Born from a love of design and comfort. We craft pieces that last.</p>
    </section>
    <div style="max-width:760px;margin:0 auto;text-align:center;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.05)">
      <h2 style="margin-top:0">Our Mission</h2>
      <p>Make elevated essentials accessible — responsibly made, beautifully designed, and joyful to wear.</p>
      <h3>Our Values</h3>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
        <div class="card" style="padding:12px"><strong>Quality</strong><p class="muted">Thoughtful materials and long-lasting construction.</p></div>
        <div class="card" style="padding:12px"><strong>Comfort</strong><p class="muted">Everyday pieces that move with you.</p></div>
        <div class="card" style="padding:12px"><strong>Sustainability</strong><p class="muted">Lower impact choices across our supply chain.</p></div>
      </div>
      <h3 style="margin-top:16px">Timeline</h3>
      <ul style="list-style:none;padding:0;margin:0;text-align:left">
        <li>2023 — Mogox concept sketched in Berlin.
        <li>2024 — First capsule collection launches online.
        <li>2025 — Community-powered design feedback program.
      </ul>
      <div style="height:12px"></div>
      <h3>Contact & Location</h3>
      <p style="margin:8px 0">Preferred location: <strong>Berlin, Germany</strong></p>
      <p style="margin:8px 0">Phone: <a href="tel:+493012345678" aria-label="Call Mogox Berlin">+49 30 1234 5678</a></p>
      <p style="margin:8px 0">Email: <a href="mailto:hello@mogox.store">hello@mogox.store</a></p>
      <div style="height:12px"></div>
      <div style="border-radius:12px;overflow:hidden">
        <iframe title="Mogox Berlin Location" width="100%" height="320" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Berlin%20Germany&output=embed"></iframe>
      </div>
    </div>
  `;
  $app.focus();
}

// ---------- RENDER: LOGIN ----------
function renderLogin(){
  document.title = 'Login — Mogox';
  const user = localStorage.getItem('mogox_user');
  if(user){
    $app.innerHTML = `
      <section class="hero"><h1>Welcome back</h1><p>You are signed in.</p></section>
      <div style="text-align:center">
        <button id="logout" class="btn btn-ghost">Logout</button>
      </div>`;
    document.getElementById('logout').addEventListener('click', ()=>{
      localStorage.removeItem('mogox_user');
      document.getElementById('nav-auth').textContent = 'Login';
      renderLogin();
    });
    $app.focus();
    return;
  }
  $app.innerHTML = `
    <section class="hero" aria-labelledby="login-title">
      <h1 id="login-title">Login</h1>
      <p>Access your wishlist and faster checkout.</p>
    </section>
    <form id="login-form" style="max-width:420px;margin:0 auto;background:#fff;padding:16px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.05)">
      <label>Email</label>
      <input class="input" id="login-email" type="email" required />
      <label style="margin-top:8px">Password</label>
      <input class="input" id="login-pass" type="password" required />
      <div style="margin-top:12px;text-align:center">
        <button class="btn btn-primary" type="submit">Sign in</button>
      </div>
    </form>
  `;
  document.getElementById('login-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if(email){
      localStorage.setItem('mogox_user', JSON.stringify({ email }));
      document.getElementById('nav-auth').textContent = 'Account';
      location.hash = '#/';
    }
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
  // Dropdown (Shop)
  if($dropdown){
    const trigger = $dropdown.querySelector('.dropdown-trigger');
    const menu = $dropdown.querySelector('.dropdown-menu');
    function open(){ $dropdown.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
    function close(){ $dropdown.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }
    trigger.addEventListener('click', (e)=>{
      e.preventDefault();
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    trigger.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowDown'){ e.preventDefault(); open(); menu.querySelector('.dropdown-item')?.focus(); }
    });
    menu.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){ close(); trigger.focus(); }
    });
    document.addEventListener('click', (e)=>{
      if(!$dropdown.contains(e.target)) close();
    });
  }

  // Mini cart
  if($miniCartWrap){
    function openMini(){ $miniCartWrap.classList.add('open'); $navCart.setAttribute('aria-expanded','true'); }
    function closeMini(){ $miniCartWrap.classList.remove('open'); $navCart.setAttribute('aria-expanded','false'); }
    $navCart.addEventListener('click', (e)=>{
      // toggle mini cart without navigating away immediately
      const href = $navCart.getAttribute('href');
      if(href === '#/cart'){
        e.preventDefault();
        const isOpen = $miniCartWrap.classList.contains('open');
        isOpen ? closeMini() : openMini();
      }
    });
    document.addEventListener('click', (e)=>{
      if(!$miniCartWrap.contains(e.target)) closeMini();
    });
  }
  // custom cursor behavior
  const cursor = document.getElementById('cursor');
  if(cursor){
    let raf = null;
    let targetX = 0, targetY = 0;
    let x = 0, y = 0;
    function loop(){
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener('mousemove', (e)=>{
      targetX = e.clientX; targetY = e.clientY; cursor.classList.add('show');
      if(!raf) raf = requestAnimationFrame(loop);
    });
    window.addEventListener('mousedown', ()=> cursor.classList.add('active'));
    window.addEventListener('mouseup', ()=> cursor.classList.remove('active'));
    window.addEventListener('blur', ()=> cursor.classList.remove('show'));
  }
  // footer newsletter
  const newsletter = document.getElementById('newsletter');
  if(newsletter){
    newsletter.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Thanks for subscribing!');
      e.target.reset();
    });
  }
  // nav auth text
  const user = localStorage.getItem('mogox_user');
  if(user){
    const auth = document.getElementById('nav-auth');
    if(auth) auth.textContent = 'Account';
  }
});

// ---- Mini cart renderer ----
function renderMiniCart(items){
  if(!$miniCart) return;
  const list = items && items.length ? items : STORE.loadCart();
  if(list.length === 0){
    $miniCart.innerHTML = '<div id="mini-cart-content"><p class="muted" style="margin:6px">Your cart is empty.</p></div>';
    return;
  }
  const subtotal = list.reduce((s,i)=> s + i.price * i.qty, 0);
  const html = `
    <div id="mini-cart-content">
      ${list.map(it => `
        <div class="item">
          <img src="${it.image}" alt="${it.title}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${GENERIC_FALLBACK}'" />
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between"><strong>${it.title}</strong><span>x${it.qty}</span></div>
            <div class="muted" style="font-size:0.9rem">${formatCurrency(it.price)} • ${it.size}</div>
          </div>
          <button class="btn btn-ghost" data-remove-mini="${it.productId}||${it.size}" aria-label="Remove ${it.title}">×</button>
        </div>
      `).join('')}
      <div class="total"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
      <div class="actions">
        <a class="btn btn-ghost" href="#/cart">View cart</a>
        <a class="btn btn-primary" href="#/checkout">Checkout</a>
      </div>
    </div>`;
  $miniCart.innerHTML = html;
  $miniCart.querySelectorAll('[data-remove-mini]').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const [pid, size] = btn.getAttribute('data-remove-mini').split('||');
      STORE.removeItem(pid, size);
      updateCartCount();
    });
  });
}

// Listen to cart changes from other tabs
window.addEventListener('storage', ()=> updateCartCount());
