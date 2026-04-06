import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  DropdownBar,
} from "../components/UpperBar";
import AuthStatus from "../components/AuthStatus";
import Logo from "../images/Logo.png";
import { colors } from "../palette/color.js";

export default function EditModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Tactics",
    difficulty: "Beginner",
  });

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    loadModule();
  }, [id]);

  async function loadModule() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:3000/modules/${id}`);
      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to load module");
      }

      const data = JSON.parse(text);
      setModule(data);

      setForm({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "Tactics",
        difficulty: data.difficulty || "Beginner",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load module");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to edit a module.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(`http://localhost:3000/modules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to update module");
      }

      const updated = JSON.parse(text);
      setModule(updated);
      setMessage("Module updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update module");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteModule() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module? This action cannot be undone."
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete a module.");
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setMessage("");

      const response = await fetch(`http://localhost:3000/modules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to delete module");
      }

      navigate("/create");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete module");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ color: "black", padding: "2rem" }}>
        Loading module...
      </div>
    );
  }

  if (error && !module) {
    return (
      <div style={{ color: "red", padding: "2rem", whiteSpace: "pre-wrap" }}>
        {error}
      </div>
    );
  }

  const isOwner =
    currentUser &&
    module &&
    typeof module.user_id !== "undefined" &&
    currentUser.user_id === module.user_id;

  if (!isOwner) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.background,
          color: colors.white,
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Access denied</h1>
        <p style={{ color: colors.text }}>
          You can only edit modules that you own.
        </p>
        <Link
          to={`/modules/${id}`}
          style={{
            color: colors.buttonPrimary,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Module
        </Link>
      </div>
    );
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
          <UpperBarLogo onClick={() => navigate("/")}>
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
          <AuthStatus />

          <DropdownBar
            title="Menu"
            links={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Explore", href: "/modules" },
              { label: "Create", href: "/create" },
              { label: "My Modules", href: "/modules/7" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "36px 24px 60px",
          color: colors.white,
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Link
            to={`/modules/${id}`}
            style={{
              color: colors.text,
              textDecoration: "none",
            }}
          >
            ← Back to Module
          </Link>
        </div>

        <section
          style={{
            background: colors.surface || "#2A2A2A",
            border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h1
            style={{
              marginTop: 0,
              marginBottom: "8px",
              fontSize: "2.2rem",
            }}
          >
            Edit Module
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: "24px",
              color: colors.text,
              lineHeight: 1.6,
            }}
          >
            Update your module title, description, category, and difficulty.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <label>
              Module Title
              <br />
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
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
              Description
              <br />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={5}
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
              Category
              <br />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "1px solid #555",
                }}
              >
                <option value="Tactics">Tactics</option>
                <option value="Openings">Openings</option>
                <option value="Strategy">Strategy</option>
                <option value="Endgames">Endgames</option>
              </select>
            </label>

            <label>
              Difficulty
              <br />
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "1px solid #555",
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            {message && (
              <p style={{ color: "#7CFC98", margin: 0 }}>{message}</p>
            )}

            {error && (
              <p style={{ color: "red", margin: 0, whiteSpace: "pre-wrap" }}>
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: colors.buttonPrimary,
                    color: colors.white,
                    border: "none",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  to={`/modules/${id}`}
                  style={{
                    background: colors.surfaceLight || "#3A3A3A",
                    color: colors.white,
                    padding: "14px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </Link>
              </div>

              <button
                type="button"
                onClick={handleDeleteModule}
                disabled={deleting}
                style={{
                  background: "#8B1E1E",
                  color: colors.white,
                  border: "none",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete Module"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}