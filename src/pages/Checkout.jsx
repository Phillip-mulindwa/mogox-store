import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotals } from "../utils/cart";

export default function Checkout(){
  const { items, clear } = useCart();
  const totals = calculateTotals(items);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", address:"", city:"", email:"" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.address) return alert("Please fill required fields");
    // simple order id generation
    const orderId = "ORD-" + Date.now().toString(36).slice(-6);
    // in a real app you'd send order to API. Here we clear cart and navigate
    clear();
    navigate(`/order/${orderId}`, { state: { totals } });
  };

  if (items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold">Checkout</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm">Full name</span>
          <input aria-label="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
            className="w-full p-2 border rounded" required />
        </label>
        <label className="block">
          <span className="text-sm">Address</span>
          <input aria-label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}
            className="w-full p-2 border rounded" required />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" aria-label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            className="w-full p-2 border rounded" />
        </label>

        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm">Order total: ${totals.total.toFixed(2)}</div>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Place order (simulate)</button>
      </form>
    </div>
  );
}


