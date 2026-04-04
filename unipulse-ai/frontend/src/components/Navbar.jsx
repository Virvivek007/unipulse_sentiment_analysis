import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="topbar">
      <div className="brand-lockup">
        <span className="brand-mark">⚡</span>
        <div>
          <div className="brand-name">UniPulse AI</div>
          <div className="brand-tag">Live sentiment intelligence</div>
        </div>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Dashboard
        </Link>
        <Link to="/compare" className="nav-link nav-link-accent">
          Compare
        </Link>
      </div>
    </nav>
  );
}