import React from "react";
import "../styles/title.css";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import Garage from "../pages/Garage";
import Winners from "../pages/Winners";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="brand-title">ASYNC RACE</div>

      <header className="neon-topbar">
        <nav className="neon-tabs">
          <NavLink
            to="/garage"
            className={({ isActive }) =>
              `neon-tab${isActive ? " is-active" : ""}`
            }
          >
            Garage
          </NavLink>
          <NavLink
            to="/winners"
            className={({ isActive }) =>
              `neon-tab${isActive ? " is-active" : ""}`
            }
          >
            Winners
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="*" element={<Navigate to="/garage" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
