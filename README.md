Mogox Clothing Store — Option A (HTML/CSS/JS)

Overview
This is a fully client-side demo store implementing the required features using plain HTML, CSS, and vanilla JS with modules. It includes product listing and filters, product detail, cart with localStorage persistence, checkout simulation, responsive design, basic accessibility, and a live deployment config.

Tech Stack
- HTML/CSS/vanilla JS modules
- Netlify (or GitHub Pages) for deploy
- http-server for local dev

Getting Started
1. npm install
2. npm start
3. Open http://localhost:5173

Features
- Home/product listing with filters and search
- Product detail with gallery, sizes, add-to-cart
- Cart page with qty update/remove and summary
- Mini-cart in header and dropdown Shop menu
- Checkout simulation with confirmation
- Responsive layout and keyboard navigation
- Images with descriptive alt text

Cloudinary (images/videos)
- Set your cloud name in index.html via:
  <script>window.MOGOX_CLOUDINARY_CLOUD = 'YOUR_CLOUD_NAME';</script>
- All product images will be fetched via Cloudinary with automatic format/quality and size transforms.
- Optional videos: add a `videos` array (https/remote URLs) to any product in scripts/products.js; product page will render video thumbnails and play inline on click using Cloudinary video fetch.

Tests
This minimalist stack keeps tests focused on cart storage logic. You can run tests in-browser by opening tests/index.html, or migrate to a framework (e.g., Vitest) if upgrading to Option B.

Deployment
- Netlify: repo root includes netlify.toml. Drag-and-drop or connect repo.
- GitHub Pages: serve root and ensure SPA fallback.

Design decisions
- Hash-based routing for simplicity
- localStorage for cart persistence across reloads
- Images proxied through Cloudinary for reliability, quality, and sizing

Accessibility
- Focus outlines for interactive elements
- Semantic roles and labels for nav, menus, forms
- Keyboard support for dropdown and mini-cart closing via click-away

Project Structure
- index.html — layout and app mount (Cloudinary config)
- style.css — design system and components
- scripts/app.js — router and views (with video + Cloudinary)
- scripts/products.js — product data
- scripts/storage.js — cart APIs
- scripts/cloudinary.js — Cloudinary helpers
- netlify.toml — deploy config

