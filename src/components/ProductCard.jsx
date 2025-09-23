import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="bg-white border rounded p-3 flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded" />
      </Link>
      <div className="mt-3 flex-1">
        <h3 className="font-medium">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">${product.price.toFixed(2)}</div>
        <Link to={`/product/${product.id}`} className="px-3 py-1 bg-blue-600 text-white rounded">View</Link>
      </div>
    </article>
  );
}


