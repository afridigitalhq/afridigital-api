import React from "react";

/**
 * 🧠 SOFT ADMIN GATE (DEV MODE)
 * Does NOT block access yet — only warns
 */
export default function AdminGate({ children }) {

  const token = localStorage.getItem("afri_admin_token");

  if (!token) {
    console.warn("🔐 Admin mode: no token present (dev access allowed)");
  }

  return children;
}
