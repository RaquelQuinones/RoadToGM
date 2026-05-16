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

export default function SharedModulesPage() {
  const navigate = useNavigate();

  const [sharedModules, setSharedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSharedModules();
  }, []);

  async function loadSharedModules() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view shared modules.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:3000/shared/modules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Shared modules from backend:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to load shared modules");
      }

      setSharedModules(data);
    } catch (err) {
      console.error("Error loading shared modules:", err);
      setError(err.message || "Failed to load shared modules.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveSharedModule(sharedModuleId, moduleTitle) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to remove a shared module.");
      return;
    }

    if (!sharedModuleId) {
      setError("Missing shared module id.");
      return;
    }

    try {
      setRemovingId(sharedModuleId);
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:3000/shared/modules/${sharedModuleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove shared module");
      }

      setSharedModules((prev) =>
        prev.filter((module) => module.shared_module_id !== sharedModuleId)
      );

      setMessage(`"${moduleTitle}" was removed from shared modules.`);
    } catch (err) {
      console.error("Error removing shared module:", err);
      setError(err.message || "Failed to remove shared module.");
    } finally {
      setRemovingId(null);
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
              { label: "Classes", href: "/classes" },
              { label: "My Classes", href: "/my-classes" },
              { label: "Shared Modules", href: "/shared-modules" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          maxWidth: "1100px",
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
            <h1 style={{ margin: 0, fontSize: "2.3rem" }}>
              Shared Modules
            </h1>

            <p style={{ marginTop: "8px", color: colors.text }}>
              View modules shared directly with you or through one of your
              classes.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/my-classes"
              style={{
                background: colors.surfaceLight || "#3A3A3A",
                color: colors.white,
                padding: "12px 18px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              My Classes
            </Link>

            <Link
              to="/modules"
              style={{
                background: colors.buttonPrimary,
                color: colors.white,
                padding: "12px 18px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Explore Public Modules
            </Link>
          </div>
        </div>

        {message && (
          <p
            style={{
              color: "#7CFC98",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "16px",
              whiteSpace: "pre-wrap",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ color: colors.text }}>Loading shared modules...</p>
        ) : sharedModules.length === 0 ? (
          <section
            style={{
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <p style={{ color: colors.text, margin: 0 }}>
              No modules have been shared with you yet.
            </p>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {sharedModules.map((module) => (
              <div
                key={module.shared_module_id || module.module_id}
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
                        margin: "8px 0 0",
                        color: colors.text,
                        lineHeight: 1.6,
                      }}
                    >
                      {module.description || "No description provided."}
                    </p>
                  </div>

                  <div
                    style={{
                      background: "rgba(124, 252, 152, 0.15)",
                      color: "#7CFC98",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    Shared
                  </div>
                </div>

                <div style={{ color: colors.text }}>
                  <strong style={{ color: colors.white }}>Category:</strong>{" "}
                  {module.category || "Uncategorized"}
                  {" · "}
                  <strong style={{ color: colors.white }}>Difficulty:</strong>{" "}
                  {module.difficulty || "Beginner"}
                </div>

                <div style={{ color: colors.text }}>
                  <strong style={{ color: colors.white }}>Shared by:</strong>{" "}
                  {module.shared_by_username || "Unknown user"}
                  {module.class_name && (
                    <>
                      {" · "}
                      <strong style={{ color: colors.white }}>Class:</strong>{" "}
                      {module.class_name}
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to={`/modules/${module.module_id}`}
                    style={{
                      background: colors.buttonPrimary,
                      color: colors.white,
                      padding: "12px 16px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Open Module
                  </Link>

                  {module.shared_module_id && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSharedModule(
                          module.shared_module_id,
                          module.title
                        )
                      }
                      disabled={removingId === module.shared_module_id}
                      style={{
                        background: colors.surfaceLight || "#3A3A3A",
                        color: colors.white,
                        border: "none",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        cursor:
                          removingId === module.shared_module_id
                            ? "not-allowed"
                            : "pointer",
                        opacity: removingId === module.shared_module_id ? 0.7 : 1,
                      }}
                    >
                      {removingId === module.shared_module_id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}