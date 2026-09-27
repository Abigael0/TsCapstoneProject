import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="public-navbar">
      <Link to="/" className="mobile-brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-3 3v-3z"
            />
          </svg>
        </span>
        <span>ComplaintsHQ</span>
      </Link>

      <nav className="public-nav-links">
        <Link to="/login" className="public-nav-link">
          Sign in
        </Link>
        <Link to="/register" className="public-nav-link public-nav-cta">
          Sign up
        </Link>
      </nav>
    </header>
  );
}