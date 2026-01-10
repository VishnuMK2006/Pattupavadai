import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    shippingAddress: "",
    contactDetails: "",
    password: "",
  });

  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your account"),
    [mode]
  );

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        mode === "signup"
          ? {
              email: form.email.trim(),
              name: form.name.trim(),
              shipping_address: form.shippingAddress.trim(),
              contact_details: form.contactDetails.trim(),
              password: form.password,
            }
          : {
              email: form.email.trim(),
              password: form.password,
            };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to authenticate. Please try again.");
      }

      onAuthSuccess?.(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <p className="eyebrow">Pattupavadai</p>
        <h1>{title}</h1>
        <p className="muted">
          {mode === "login"
            ? "Log in to access your 3D dresser"
            : "Sign up to start saving outfits and shipping details."}
        </p>
      </div>

      <div className="auth-tabs">
        <button
          className={mode === "login" ? "active" : ""}
          type="button"
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={mode === "signup" ? "active" : ""}
          type="button"
          onClick={() => setMode("signup")}
        >
          Signup
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="input-grid">
            <label>
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Lakshmi Priya"
                required={mode === "signup"}
              />
            </label>

            <label>
              <span>Shipping Address</span>
              <input
                type="text"
                value={form.shippingAddress}
                onChange={handleChange("shippingAddress")}
                placeholder="12, Flower Street, Chennai"
                required={mode === "signup"}
              />
            </label>

            <label>
              <span>Contact Details</span>
              <input
                type="text"
                value={form.contactDetails}
                onChange={handleChange("contactDetails")}
                placeholder="+91 90000 00000"
                required={mode === "signup"}
              />
            </label>
          </div>
        )}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
}
