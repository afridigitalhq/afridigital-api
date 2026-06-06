import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppShell from "../components/appshell/AppShell";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Services from "../pages/Services";
import Jobs from "../pages/Jobs";
import Earn from "../pages/Earn";
import Boost from "../pages/Boost";
import Social from "../pages/Social";
import Wallet from "../pages/Wallet";
import Profile from "../pages/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/services" element={<Services />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/boost" element={<Boost />} />
          <Route path="/social" element={<Social />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
