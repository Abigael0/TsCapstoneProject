import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-navbar">
        <Link to="/" className="home-brand">
          <span className="brand-mark">
            <MessageSquare size={19} />
          </span>

          <span>ComplaintsHQ</span>
        </Link>

        <nav className="home-navigation">
          <Link to="/login">Sign in</Link>

          <Link
            to="/register"
            className="home-nav-button"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">
            Complaint management made clear
          </p>

          <h1>
            Report issues.
            <br />
            Track progress.
            <br />
            Get responses.
          </h1>

          <p className="hero-description">
            A centralized platform for submitting complaints,
            tracking their status, and receiving responses from
            the responsible team.
          </p>

          <div className="hero-actions">
            <Link
              to="/register"
              className="hero-primary-button"
            >
              Submit a complaint
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="hero-secondary-button"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-header">
            <span>Complaint status</span>
            <span className="hero-live-dot" />
          </div>

          <div className="hero-status-row">
            <div className="hero-status-icon">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <strong>Complaint tracked</strong>
              <span>Your issue is being reviewed.</span>
            </div>
          </div>

          <div className="hero-progress">
            <span />
          </div>

          <div className="hero-panel-footer">
            <span>Submitted</span>
            <span>In progress</span>
            <span>Resolved</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">
            <MessageSquare size={20} />
          </div>

          <h2>Simple reporting</h2>

          <p>
            Submit a complaint with the information needed
            to understand the issue.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <ShieldCheck size={20} />
          </div>

          <h2>Track your complaint</h2>

          <p>
            Monitor the status of your submitted complaints
            from one place.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <CheckCircle2 size={20} />
          </div>

          <h2>Receive responses</h2>

          <p>
            View responses and updates from the team handling
            your complaint.
          </p>
        </div>
      </section>
    </main>
  );
}