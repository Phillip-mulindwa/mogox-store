import React, { useMemo, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home(){
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(()=>["All", ...Array.from(new Set(products.map(p=>p.category)))],[]);
  const filtered = products.filter(p => (category === "All" || p.category === category)
    && p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Shop</h1>
        <p className="text-gray-600">Responsive demo store — try adding items to cart.</p>
      </div>

      <div className="flex gap-4 flex-col md:flex-row mb-6">
        <input aria-label="Search products" value={query} onChange={(e)=>setQuery(e.target.value)}
          className="flex-1 p-2 border rounded" placeholder="Search products..." />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="p-2 border rounded">
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </section>
    </div>
  );
}


