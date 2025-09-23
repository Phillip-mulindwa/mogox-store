import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Mogox Store</Link>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="relative inline-flex items-center gap-2 p-2 border rounded">
            Cart
            <span aria-hidden className="bg-blue-600 text-white text-xs rounded-full px-2">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}


