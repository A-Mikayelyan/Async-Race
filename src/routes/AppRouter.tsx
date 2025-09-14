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
      <header
        style={{
          padding: 12,
          display: "flex",
          gap: 12,
          borderBottom: "1px solid #eee",
        }}
      >
        <NavLink to="/garage">Garage</NavLink>
        <NavLink to="/winners">Winners</NavLink>
      </header>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/winners" element={<Winners />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
