import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("resetEmail");
  const otp = sessionStorage.getItem("resetOTP");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email || !otp) {
      setError(
        "Your password reset session has expired. Please start again."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setError("Password must be between 6 and 20 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        email,
        otp,
        newPassword: password,
      });

      // Clear password reset information
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOTP");

      navigate("/signin", {
        state: {
          message: "Password reset successful. You can now sign in.",
        },
      });
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
              <h2>Reset your password</h2>

              <p>
                Enter a new password for your ComplaintsHQ account.
              </p>
            </div>

            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="New password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                required
              />

              <Input
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                required
              />

              <Button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset password"}
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