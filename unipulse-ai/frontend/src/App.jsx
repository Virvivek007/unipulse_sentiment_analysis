import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import Navbar from "./components/Navbar";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: "100vh", background: "#0d0f1a" }}>
        <Navbar />
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </div>
    </HashRouter>
  );
}