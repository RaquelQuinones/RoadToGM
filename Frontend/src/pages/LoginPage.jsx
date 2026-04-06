import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  UpperBarButton,
  DropdownBar,
} from "../components/UpperBar";
import Logo from "../images/Logo.png";
import { colors } from "../palette/color.js";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Login failed");
      }

      const data = JSON.parse(text);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));

      setMessage("Login successful.");
      navigate("/modules");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <UpperBar>
        <UpperBarLeft>
          <UpperBarLogo>
            <img
              src={Logo}
              alt="Road To GM Logo"
              style={{ height: "40px" }}
            />
          </UpperBarLogo>

          <UpperBarTitle style={{ color: colors.white }}>
            Road To GM
          </UpperBarTitle>
        </UpperBarLeft>

        <UpperBarRight>
          <UpperBarButton onClick={() => navigate("/signup")}>
            Sign Up
          </UpperBarButton>

          <DropdownBar
            title="Menu"
            links={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Explore", href: "/modules" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        <div
          style={{
            background: colors.surface || "#2A2A2A",
            border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
            borderRadius: "20px",
            padding: "28px",
            color: colors.white,
          }}
        >
          <h1
            style={{
              marginTop: 0,
              marginBottom: "8px",
              fontSize: "2.2rem",
            }}
          >
            Login
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: "24px",
              color: colors.text,
              lineHeight: 1.6,
            }}
          >
            Sign in to create, edit, and publish your own modules.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <label>
              Email
              <br />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "1px solid #555",
                }}
              />
            </label>

            <label>
              Password
              <br />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "1px solid #555",
                }}
              />
            </label>

            {error && (
              <p style={{ color: "red", margin: 0 }}>{error}</p>
            )}

            {message && (
              <p style={{ color: "#7CFC98", margin: 0 }}>{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: colors.buttonPrimary,
                color: colors.white,
                border: "none",
                padding: "14px 20px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              color: colors.text,
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: colors.buttonPrimary,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}