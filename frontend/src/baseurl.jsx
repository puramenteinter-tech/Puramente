// Allow overriding via Vite env (VITE_API_BASE_URL). Fallback to localhost.
// const BaseURL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000";
// ✅ Correct
// const BaseURL = import.meta.env?.VITE_API_BASE_URL || "https://puramentejewel.com";

const BaseURL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000";

export default BaseURL;
