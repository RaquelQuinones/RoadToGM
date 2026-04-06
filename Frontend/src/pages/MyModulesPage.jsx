import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function MyModulesPage() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMyModules();
  }, []);

  async function loadMyModules() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view your modules.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:3000/my/modules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to load your modules");
      }

      const data = JSON.parse(text);
      setModules(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load your modules.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishToggle(moduleId, currentValue) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to update publish status.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:3000/modules/${moduleId}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_published: !currentValue,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to update publish status");
      }

      const updated = JSON.parse(text);

      setModules((prev) =>
        prev.map((module) =>
          module.module_id === updated.module_id ? updated : module
        )
      );

      setMessage(
        updated.is_published
          ? `"${updated.title}" is now published.`
          : `"${updated.title}" is now unpublished.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update publish status.");
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
              { label: "My Modules", href: "/my-modules" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "36px 24px 60px",
          color: colors.white,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "2.3rem" }}>My Modules</h1>
            <p style={{ marginTop: "8px", color: colors.text }}>
              View, edit, and publish the modules you created.
            </p>
          </div>

          <Link
            to="/create"
            style={{
              background: colors.buttonPrimary,
              color: colors.white,
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            + Create Content
          </Link>
        </div>

        {message && (
          <p style={{ color: "#7CFC98", marginBottom: "16px" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red", marginBottom: "16px", whiteSpace: "pre-wrap" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ color: colors.text }}>Loading your modules...</p>
        ) : modules.length === 0 ? (
          <section
            style={{
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <p style={{ color: colors.text, margin: 0 }}>
              You haven’t created any modules yet.
            </p>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {modules.map((module) => (
              <div
                key={module.module_id}
                style={{
                  background: colors.surface || "#2A2A2A",
                  border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                  borderRadius: "18px",
                  padding: "20px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0 }}>{module.title}</h2>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        color: colors.text,
                        lineHeight: 1.6,
                      }}
                    >
                      {module.description}
                    </p>
                  </div>

                  <div
                    style={{
                      background: module.is_published
                        ? "rgba(124, 252, 152, 0.15)"
                        : "rgba(255,255,255,0.08)",
                      color: module.is_published ? "#7CFC98" : colors.text,
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {module.is_published ? "Published" : "Draft"}
                  </div>
                </div>

                <div style={{ color: colors.text }}>
                  <strong style={{ color: colors.white }}>Category:</strong>{" "}
                  {module.category}
                  {" · "}
                  <strong style={{ color: colors.white }}>Difficulty:</strong>{" "}
                  {module.difficulty || "Beginner"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      handlePublishToggle(module.module_id, module.is_published)
                    }
                    style={{
                      background: module.is_published
                        ? colors.surfaceLight || "#3A3A3A"
                        : colors.buttonPrimary,
                      color: colors.white,
                      border: "none",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {module.is_published ? "Unpublish" : "Publish"}
                  </button>

                  <Link
                    to={`/modules/${module.module_id}`}
                    style={{
                      background: "transparent",
                      color: colors.white,
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      padding: "12px 16px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    View Module
                  </Link>

                  <Link
                    to={`/modules/${module.module_id}/edit`}
                    style={{
                      background: colors.surfaceLight || "#3A3A3A",
                      color: colors.white,
                      padding: "12px 16px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Edit Module
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}