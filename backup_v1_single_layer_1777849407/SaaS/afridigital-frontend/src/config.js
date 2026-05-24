const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://afridigital-hub.onrender.com"
    : "http://localhost:5000");

export default API_BASE;
