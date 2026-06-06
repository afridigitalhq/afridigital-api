import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminGate from "./AdminGate";
import AIOSWorkspace from "../workspace/AIOSWorkspace";

/**
 * 🔐 ADMIN OS ROUTER (PROTECTED SHELL)
 */
export default function AdminRouter(props) {

  return (
    <AdminGate>
      <div style={{ height: "100vh", background: "#0b0b0b" }}>
        <AIOSWorkspace {...props} />
      </div>
    </AdminGate>
  );
}
