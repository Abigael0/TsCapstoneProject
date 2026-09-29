import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";

export default function AdminSignup({ onAdminRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await onAdminRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/admin");
    } catch (signupError) {
      setError(signupError.message || "Unable to create the admin account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page signin-page admin-signup-page">
      <div className="signin-layout">
        <section className="signin-form-panel" aria-labelledby="admin-signup-title">
          <div className="auth-card signin-form-card">
            <Link className="auth-brand" to="/" aria-label="ComplaintsHQ home">
              <span className="brand-mark" aria-hidden="true">
                <ShieldCheck size={20} />
              </span>
              <span>ComplaintsHQ</span>
            </Link>

            <div className="auth-header">
              <h2 id="admin-signup-title">Create an admin account</h2>
              <p>Enter your official work email to continue</p>
            </div>

            {error && <div className="form-alert" role="alert">{error}</div>}

            <form onSubmit={handleSubmit}>
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
              <Input
                label="Work Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="auth-submit"
              >
                Create admin account
              </Button>
            </form>

            <p className="auth-switch">
              Need a user account? <Link to="/register">Create Account</Link>
            </p>
            <p className="auth-switch admin-signup-signin">
              <Link to="/signin">Back to sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
