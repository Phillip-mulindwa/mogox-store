import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";

export default function OrderConfirmation(){
  const { orderId } = useParams();
  const { state } = useLocation();
  const totals = state?.totals;
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold">Order confirmed</h2>
      <p className="mt-2">Thank you! Your order <strong>{orderId}</strong> is received (simulation).</p>
      {totals && <div className="mt-4">
        <div>Subtotal: ${totals.subtotal}</div>
        <div>Shipping: ${totals.shipping}</div>
        <div>Tax: ${totals.tax}</div>
        <div className="font-bold">Total: ${totals.total}</div>
      </div>}
      <div className="mt-4">
        <Link to="/" className="text-blue-600">Back to shop</Link>
      </div>
    </div>
  );
}


