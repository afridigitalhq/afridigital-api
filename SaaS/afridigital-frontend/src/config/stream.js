/**
 * A3.2 STREAM CONFIG LAYER
 * Single source of truth for realtime feeds
 */

export const STREAM_URL =
  import.meta.env.VITE_WS_URL || "wss://afridigital-api.onrender.com";
