import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotals } from "../utils/cart";

export default function CartPage(){
  const { items, update, remove } = useCart();
  const totals = calculateTotals(items);
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      {items.length === 0 ? (
        <div>No items. <Link to="/">Continue shopping</Link></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ul className="space-y-4">
              {items.map(it => (
                <li key={`${it.productId}-${it.size}`} className="p-4 bg-white rounded flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium">{it.title}</div>
                    {it.size && <div className="text-sm text-gray-500">Size: {it.size}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input aria-label={`Quantity for ${it.title}`} type="number" min="1" value={it.qty}
                      onChange={(e)=> update(it.productId, it.size, Number(e.target.value))}
                      className="w-20 p-1 border rounded" />
                    <div className="w-24 text-right font-semibold">${(it.price * it.qty).toFixed(2)}</div>
                    <button onClick={()=> remove(it.productId, it.size)} className="p-2 text-red-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="p-4 bg-white rounded">
            <div className="text-sm">Subtotal: ${totals.subtotal.toFixed(2)}</div>
            <div className="text-sm">Shipping: ${totals.shipping.toFixed(2)}</div>
            <div className="text-sm">Tax: ${totals.tax.toFixed(2)}</div>
            <div className="font-bold text-lg mt-2">Total: ${totals.total.toFixed(2)}</div>
            <button onClick={()=> navigate("/checkout")} className="mt-4 w-full py-2 bg-green-600 text-white rounded">Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
}


