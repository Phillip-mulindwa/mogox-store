# Mogox Clothing Store — Demo

Stack: React + Vite + Tailwind

## Run locally
1. npm install
2. npm run dev
Open http://localhost:5173

## Build
npm run build
npm run preview

## Tests
npm run test

## Deploy
Push to GitHub and connect to Vercel (or Netlify). Build command: `npm run build`, dist: `dist`.

## Design & decisions
- Client-only demo with products in `src/data/products.js`.
- Cart persisted to localStorage.
- Accessibility: alt text, labelled inputs, keyboard navigation.

## Notes
- Checkout simulates order creation; no real payments.
