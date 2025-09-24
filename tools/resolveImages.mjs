#!/usr/bin/env node
// Resolve product images via Unsplash API and write data/images.json mapping
import fs from 'fs/promises';
import path from 'path';
import JSON5 from 'json5';
import fetch from 'node-fetch';

const ROOT = process.cwd();
const PRODUCTS_FILE = path.join(ROOT, 'scripts', 'products.js');
const OUT_DIR = path.join(ROOT, 'data');
const OUT_FILE = path.join(OUT_DIR, 'images.json');
const QUERIES_FILE = path.join(OUT_DIR, 'queries.json');
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_KEY || '';

if(!ACCESS_KEY){
  console.error('Error: Set UNSPLASH_ACCESS_KEY env var to your Unsplash access key.');
  process.exit(1);
}

const CATEGORY_HINTS = {
  tops: ['t-shirt', 'shirt', 'top', 'tee', 'oxford'],
  outerwear: ['jacket', 'coat', 'puffer', 'parka', 'denim jacket'],
  bottoms: ['jeans', 'pants', 'trousers', 'shorts', 'skirt', 'leggings', 'cargo pants'],
  dresses: ['dress', 'midi dress'],
  shoes: ['sneakers', 'boots', 'chelsea boots', 'sandals'],
  accessories: ['beanie', 'hat', 'belt', 'sunglasses', 'socks']
};

const NEGATIVE_TERMS = ['food', 'pizza', 'burger', 'landscape', 'mountain', 'beach', 'car', 'computer', 'bitcoin', 'crypto', 'blockchain', 'money', 'coin'];

// Stricter required terms for flagged products
const REQUIRED_BY_ID = {
  '2': ['denim','jacket'],
  '16': ['running','leggings'],
  '14': ['pleated','skirt'],
  '13': ['ribbed','top'],
  '20': ['sandals'],
  '19': ['linen','shirt'],
  '10': ['sunglass'],
  '12': ['cargo'],
  '5': ['shorts'],
  '17': ['chelsea','boot']
};

async function loadProducts(){
  const raw = await fs.readFile(PRODUCTS_FILE, 'utf8');
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  const arrStr = raw.slice(start, end+1);
  const products = JSON5.parse(arrStr);
  return products;
}

async function loadCustomQueries(){
  try {
    const raw = await fs.readFile(QUERIES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function buildQuery(p, custom){
  if(custom && custom[p.id]) return custom[p.id];
  const hints = CATEGORY_HINTS[p.category] || [];
  const gender = p.gender && p.gender !== 'unisex' ? p.gender : '';
  const terms = [p.title, ...hints, gender, 'apparel', 'studio', 'product'].filter(Boolean);
  return terms.join(' ');
}

function goodResult(r, requiredTerms){
  const text = `${r.description || ''} ${r.alt_description || ''}`.toLowerCase();
  if(NEGATIVE_TERMS.some(bad => text.includes(bad))) return false;
  const ok = /shirt|jacket|coat|jeans|pants|shorts|skirt|dress|sneaker|boot|sandal|beanie|hat|belt|sunglass|sock|apparel|clothing/;
  const tagMatch = (r.tags || []).some(t => ok.test((t.title||'').toLowerCase()));
  const baseOk = ok.test(text) || tagMatch;
  if(!requiredTerms || requiredTerms.length === 0) return baseOk;
  const hasRequired = requiredTerms.every(term => {
    const re = new RegExp(term, 'i');
    return re.test(text) || (r.tags||[]).some(t => re.test(t.title||''));
  });
  return baseOk && hasRequired;
}

async function searchUnsplash(q){
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', q);
  url.searchParams.set('orientation', 'squarish');
  url.searchParams.set('content_filter', 'high');
  url.searchParams.set('per_page', '20');
  const res = await fetch(url.toString(), { headers: { Authorization: `Client-ID ${ACCESS_KEY}` }});
  if(!res.ok){
    const t = await res.text();
    throw new Error(`Unsplash error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function resolveForProduct(p, custom){
  const q = buildQuery(p, custom);
  const results = await searchUnsplash(q);
  const required = REQUIRED_BY_ID[p.id] || [];
  const filtered = results.filter(r => goodResult(r, required));
  const pick = (filtered.length ? filtered : results).slice(0, 12);
  const urls = pick.map(r => r.urls && (r.urls.raw || r.urls.full || r.urls.regular)).filter(Boolean);
  if(urls.length === 0){
    return null;
  }
  const unique = Array.from(new Set(urls));
  return unique.slice(0, 3);
}

async function main(){
  const products = await loadProducts();
  const custom = await loadCustomQueries();
  const out = {};
  let okCount = 0;
  for(const p of products){
    try {
      const imgs = await resolveForProduct(p, custom);
      if(imgs && imgs.length){
        out[p.id] = imgs;
        okCount++;
        console.log(`✔ ${p.id} ${p.title} -> ${imgs.length} images`);
      } else {
        console.warn(`! No images for ${p.id} ${p.title}`);
      }
      await wait(220);
    } catch (e) {
      console.warn(`! Error for ${p.id} ${p.title}:`, e.message);
    }
  }
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2));
  console.log(`\nDone. Resolved ${okCount}/${products.length}. Wrote ${OUT_FILE}`);
}

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

main().catch(err => { console.error(err); process.exit(1); });

