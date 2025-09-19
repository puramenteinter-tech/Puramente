// Allow overriding via Vite env (VITE_API_BASE_URL). Fallback to localhost.
const BaseURL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000";

export default BaseURL;
