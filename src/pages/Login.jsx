import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const user = await onLogin(form);

      navigate(
        user?.role === "admin"
          ? "/admin"
          : "/dashboard"
      );
    } catch (loginError) {
      setError(
        loginError.message ||
          "Unable to sign in. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-3 3v-3z"
              />
            </svg>
          </div>

          <span>ComplaintsHQ</span>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your complaints.</p>
        </div>

        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit"
          >
            <LogIn size={17} />
            Sign in
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}