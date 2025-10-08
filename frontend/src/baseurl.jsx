// Allow overriding via Vite env (VITE_API_BASE_URL). Fallback to localhost.
let BaseURL;

if (window.location.hostname === "localhost") {
  BaseURL = "http://localhost:4000";
} else {
  BaseURL = "https://puramentejewel.com";
}

export default BaseURL;

// const BaseURL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:4000";


