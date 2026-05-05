/**
 * AfriDigital API CONFIG (PRODUCTION SPLIT ARCHITECTURE)
 * Frontend → Backend communication layer
 */

const API_BASE_URL = "https://afridigital-api.onrender.com";

export const API = {
  base: API_BASE_URL,

  auth: {
    login: `${API_BASE_URL}/api/login`,
    register: `${API_BASE_URL}/api/register`,
  },

  modules: {
    chat: `${API_BASE_URL}/modules/chat`,
    payments: `${API_BASE_URL}/modules/payments`,
    ai: `${API_BASE_URL}/modules/ai-engine`,
    dashboard: `${API_BASE_URL}/modules/dashboard`,
  }
};

export default API;
