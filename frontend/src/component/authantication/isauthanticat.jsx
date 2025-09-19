import { clearCart as clearCartDB } from "../newcomponent/db";
import axios from "axios";
import BaseURL from "../../baseurl";

export function Isauthanticate() {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
}
export function IsAdmin() {
  return localStorage.getItem("role") === "admin";
}



export async function Logout() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Clear server cart for this user if logged in
  if (userId && token) {
    try {
      await axios.delete(`${BaseURL}/api/cart/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (_) {}
  }

  // Clear client cart (IndexedDB + localStorage)
  try {
    await clearCartDB();
  } catch (_) {}
  localStorage.removeItem("cart");

  // Remove auth/user identifiers
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  window.location.reload();
}
