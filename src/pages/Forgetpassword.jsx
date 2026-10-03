import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setNotice("");
    setError("");
    setLoading(true);

    try {
      await api.forgotPassword({ email });

      // Save email so VerifyOtp knows which account is being verified
      sessionStorage.setItem("resetEmail", email.trim().toLowerCase());

      setNotice("A verification code has been sent to your email.");

      navigate("/verify-otp");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page signin-page">
      <div className="signin-layout">
        <section className="signin-form-panel">
          <div className="auth-card signin-form-card">

            <Link
              className="auth-brand"
              to="/"
              aria-label="ComplaintsHQ home"
            >
              <span className="brand-mark" aria-hidden="true">
                <MailCheck size={20} />
              </span>

              <span>ComplaintsHQ</span>
            </Link>

            <div className="auth-header">
              <h2>Forgot your password?</h2>

              <p>
                Enter your email address and we'll send you a
                6-digit verification code.
              </p>
            </div>

            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}

            {notice && (
              <div className="form-alert" role="status">
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                required
              />

              <Button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send verification code"}
              </Button>
            </form>

            <p className="auth-switch">
              <Link to="/signin">Back to sign in</Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}