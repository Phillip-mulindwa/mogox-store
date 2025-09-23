import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail(){
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  if (!product) return <div>Product not found</div>;

  const addHandler = () => {
    if (product.sizes.length && !size) return alert("Please select a size");
    add(product, size, qty);
    // simple confirmation
    alert("Added to cart");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={product.images[0]} alt={product.title} className="w-full h-[480px] object-cover rounded" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600 my-2">{product.description}</p>
        <div className="text-xl font-semibold">${product.price.toFixed(2)}</div>

        {product.sizes.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm">Size</label>
            <select aria-label="Choose size" value={size} onChange={(e)=>setSize(e.target.value)} className="p-2 border rounded">
              <option value="">Select size</option>
              {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <label className="sr-only">Quantity</label>
          <input type="number" aria-label="Quantity" value={qty} min={1} onChange={(e)=>setQty(Number(e.target.value))}
            className="w-24 p-2 border rounded" />
          <button onClick={addHandler} className="px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
        </div>

        <div className="mt-6">
          <Link to="/cart" className="text-sm hover:underline">Go to cart</Link>
        </div>
      </div>
    </div>
  );
}


