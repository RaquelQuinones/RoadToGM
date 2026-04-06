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

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
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
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Signup failed");
      }

      setMessage("Account created successfully. You can now log in.");

      setForm({
        username: "",
        email: "",
        password: "",
        role: "student",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
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
          <UpperBarButton onClick={() => navigate("/login")}>
            Login
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
          maxWidth: "560px",
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
            Sign Up
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: "24px",
              color: colors.text,
              lineHeight: 1.6,
            }}
          >
            Create an account to build and manage your own chess modules.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <label>
              Username
              <br />
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
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

            <label>
              Role
              <br />
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "1px solid #555",
                }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              color: colors.text,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: colors.buttonPrimary,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}