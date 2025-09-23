import React, { createContext, useContext, useEffect, useReducer } from "react";
import { addToCart as addFn, updateQty as updateFn, removeFromCart as removeFn } from "../utils/cart";

const CartContext = createContext();

const LOCAL_KEY = "mogox_cart_v1";

function reducer(state, action) {
  switch (action.type) {
    case "INIT": return { ...state, items: action.payload || [] };
    case "ADD":
      return { ...state, items: addFn(state.items, action.product, action.size, action.qty) };
    case "UPDATE":
      return { ...state, items: updateFn(state.items, action.productId, action.size, action.qty) };
    case "REMOVE":
      return { ...state, items: removeFn(state.items, action.productId, action.size) };
    case "CLEAR":
      return { ...state, items: [] };
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) dispatch({ type: "INIT", payload: JSON.parse(raw) });
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const add = (product, size, qty = 1) => dispatch({ type: "ADD", product, size, qty });
  const update = (productId, size, qty) => dispatch({ type: "UPDATE", productId, size, qty });
  const remove = (productId, size) => dispatch({ type: "REMOVE", productId, size });
  const clear = () => dispatch({ type: "CLEAR" });

  return <CartContext.Provider value={{ items: state.items, add, update, remove, clear }}>
    {children}
  </CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
export default CartContext;


