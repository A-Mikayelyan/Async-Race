import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function TopNav() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "g") navigate("/garage");
      if (k === "w") navigate("/winners");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <header className="neon-topbar" role="navigation" aria-label="Primary">
      <nav className="neon-tabs">
        <NavLink
          to="/garage"
          className={({ isActive }) =>
            `neon-tab ${isActive ? "is-active" : ""}`
          }
        >
          Garage
        </NavLink>
        <NavLink
          to="/winners"
          className={({ isActive }) =>
            `neon-tab ${isActive ? "is-active" : ""}`
          }
        >
          Winners
        </NavLink>
      </nav>
    </header>
  );
}
