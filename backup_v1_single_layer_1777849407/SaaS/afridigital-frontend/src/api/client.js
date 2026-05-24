const API = import.meta.env.VITE_API_URL;

export const api = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export const get = (p) => api(p);
export const post = (p, data) =>
  api(p, {
    method: "POST",
    body: JSON.stringify(data)
  });

export default API;
