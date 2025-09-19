import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../baseurl";
import { getCartItems, saveCartItem, clearCart as clearCartDB, openDB } from "../newcomponent/db";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const computeImageUrl = (it) => {
    if (it?.imageUrl && typeof it.imageUrl === "string") return it.imageUrl;
    if (it?.imageurl && typeof it.imageurl === "string") return it.imageurl;
    if (it?.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_400,h_400,q_auto:good,f_auto/${it.cloudinaryId}`;
    }
    return "";
  };

  // ✅ Login ke baad backend se cart set karne ke liye helper
  const normalizeFromServer = (items = []) => {
    return items.map((it) => {
      const productId = (it.productId && it.productId.toString) ? it.productId.toString() : (it.productId || it._id || it.id);
      const imageUrl = computeImageUrl(it);
      return {
        _id: productId,
        name: it.name,
        price: Number(it.price || 0),
        quantity: Math.max(1, Number(it.quantity || 1)),
        imageUrl,
        imageurl: imageUrl
      };
    });
  };

  const normalizeLocal = (items = []) => {
    return items.map((it) => {
      const imageUrl = computeImageUrl(it);
      return {
        ...it,
        _id: it._id || it.id || it.productId || it.product_id,
        price: Number(it.price || 0),
        quantity: Math.max(1, Number(it.quantity || 1)),
        imageUrl,
        imageurl: imageUrl
      };
    });
  };

  const setCartFromBackend = (items) => {
    const normalized = normalizeFromServer(items || []);
    setCartItems(normalized);
    localStorage.setItem("cart", JSON.stringify(normalized));
  };

  // ✅ Mount pe local cart load
  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        // Logged-in: hydrate from backend
        try {
          const res = await axios.get(`${BaseURL}/api/cart/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const items = res.data?.items || [];
          const normalized = normalizeFromServer(items);
          setCartItems(normalized);
          localStorage.setItem("cart", JSON.stringify(normalized));
          return;
        } catch (_) {
          // fallthrough to local
        }
      }

      // Guest/local fallback
      const storedCart = localStorage.getItem("cart");
      if (storedCart && storedCart !== "[]") {
        const parsed = JSON.parse(storedCart);
        const normalized = normalizeLocal(parsed);
        setCartItems(normalized);
        localStorage.setItem("cart", JSON.stringify(normalized));
        return;
      }
      const items = await getCartItems();
      if (items?.length) {
        const normalized = normalizeLocal(items);
        setCartItems(normalized);
        localStorage.setItem("cart", JSON.stringify(normalized));
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
    const resolvedImageUrl = computeImageUrl(product);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: Math.max(1, item.quantity + qty), imageUrl: item.imageUrl || resolvedImageUrl, imageurl: item.imageurl || resolvedImageUrl }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: qty, imageUrl: resolvedImageUrl, imageurl: resolvedImageUrl }];
    }

    setCartItems(updatedCart);
    await saveCartItem(existingItem
      ? { ...existingItem, _id: existingItem._id, quantity: Math.max(1, existingItem.quantity + qty), imageUrl: existingItem.imageUrl || resolvedImageUrl, imageurl: existingItem.imageurl || resolvedImageUrl }
      : { ...product, _id: product._id || product.id, quantity: qty, imageUrl: resolvedImageUrl, imageurl: resolvedImageUrl }
    );

    // ✅ Backend save
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      await axios.post(`${BaseURL}/api/cart/add`, {
        userId,
        productId: product._id,
        name: product.name,
        price: product.price || 0,
        quantity: qty,
        imageUrl: resolvedImageUrl
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

    // ✅ Backend quantity sync when logged in
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      try {
        await axios.put(
          `${BaseURL}/api/cart/quantity`,
          {
            userId,
            productId: _id,
            quantity: newQuantity,
            name: updatedItem?.name,
            price: updatedItem?.price || 0,
            imageUrl: updatedItem?.imageUrl || updatedItem?.imageurl,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (_) {
        // ignore for now
      }
    }
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
