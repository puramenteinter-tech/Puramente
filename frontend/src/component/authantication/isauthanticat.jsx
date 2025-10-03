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

  // Do NOT clear server cart on logout; we want persistence across sessions

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
