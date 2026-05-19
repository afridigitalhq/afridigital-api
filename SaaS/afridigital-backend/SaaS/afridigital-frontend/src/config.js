const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://afridigital-hub.onrender.com"
    : "https://afridigital-api.onrender.com");

export default API_BASE;
