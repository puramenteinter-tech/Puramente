import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../baseurl";
import { getCartItems, saveCartItem, clearCart as clearCartDB, openDB } from "../newcomponent/db";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Login ke baad backend se cart set karne ke liye helper
  const setCartFromBackend = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // ✅ Mount pe local cart load
  useEffect(() => {
    async function fetchCart() {
      const storedCart = localStorage.getItem("cart");
      if (storedCart && storedCart !== "[]") {
        setCartItems(JSON.parse(storedCart));
        return;
      }
      const items = await getCartItems();
      if (items?.length) {
        setCartItems(items);
        localStorage.setItem("cart", JSON.stringify(items));
      }
    }
    fetchCart();
  }, []);

  // ✅ Har update pe LocalStorage sync
  useEffect(() => {
    if (cartItems?.length) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.setItem("cart", "[]");
    }
  }, [cartItems]);

  // ✅ Backend + Local cart sync addToCart
  const addToCart = async (product) => {
    const qty = product.quantity || 1;
    const existingItem = cartItems.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: Math.max(1, item.quantity + qty) }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: qty }];
    }

    setCartItems(updatedCart);
    await saveCartItem(existingItem
      ? { ...existingItem, quantity: Math.max(1, existingItem.quantity + qty) }
      : { ...product, quantity: qty }
    );

    // ✅ Backend save
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      await axios.post(`${BaseURL}/api/cart/add`, {
        userId,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        imageUrl: product.imageUrl
      }, { headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const updateQuantity = async (_id, quantity) => {
    const newQuantity = Math.max(1, quantity);
    const updatedCart = cartItems.map((item) =>
      item._id === _id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);

    const updatedItem = updatedCart.find((item) => item._id === _id);
    if (updatedItem) await saveCartItem(updatedItem);

    // Backend update logic yaha add kar sakte ho agar API bana ho
  };

  const removeFromCart = async (_id) => {
    const updatedCart = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedCart);

    const db = await openDB();
    const tx = db.transaction("cart", "readwrite");
    tx.objectStore("cart").delete(_id);
    await tx.complete;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      await axios.delete(`${BaseURL}/api/cart/remove/${userId}/${_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  const clearCart = async () => {
    await clearCartDB();
    setCartItems([]);
    localStorage.removeItem("cart");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      await axios.delete(`${BaseURL}/api/cart/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCartFromBackend // ✅ new helper
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
