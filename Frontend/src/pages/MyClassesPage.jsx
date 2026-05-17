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

export default function MyClassesPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMyClasses();
  }, []);

  async function loadMyClasses() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view your classes.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/my/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load your classes");
      }

      setClasses(data);
    } catch (err) {
      console.error("Error loading classes:", err);
      setError(err.message || "Failed to load your classes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinClass(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to join a class.");
      return;
    }

    if (!joinCode.trim()) {
      setError("Please enter a class join code.");
      return;
    }

    try {
      setJoining(true);
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:3000/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          join_code: joinCode.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join class");
      }

      setMessage(data.message || "Joined class successfully.");
      setJoinCode("");

      await loadMyClasses();
    } catch (err) {
      console.error("Error joining class:", err);
      setError(err.message || "Failed to join class.");
    } finally {
      setJoining(false);
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
            <h1 style={{ margin: 0, fontSize: "2.3rem" }}>My Classes</h1>
            <p style={{ marginTop: "8px", color: colors.text }}>
              Join classes using a code and access modules shared with your
              class.
            </p>
          </div>

          <Link
            to="/shared-modules"
            style={{
              background: colors.buttonPrimary,
              color: colors.white,
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            View Shared Modules
          </Link>
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

        <section
          style={{
            background: colors.surface || "#2A2A2A",
            border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Join a Class</h2>

          <form
            onSubmit={handleJoinClass}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter join code"
              style={{
                minWidth: "240px",
                flex: "1",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #555",
                boxSizing: "border-box",
                textTransform: "uppercase",
              }}
            />

            <button
              type="submit"
              disabled={joining}
              style={{
                background: colors.buttonPrimary,
                color: colors.white,
                border: "none",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: joining ? "not-allowed" : "pointer",
                opacity: joining ? 0.7 : 1,
              }}
            >
              {joining ? "Joining..." : "Join Class"}
            </button>
          </form>
        </section>

        <section>
          <h2 style={{ marginBottom: "16px" }}>Classes I Belong To</h2>

          {loading ? (
            <p style={{ color: colors.text }}>Loading classes...</p>
          ) : classes.length === 0 ? (
            <div
              style={{
                background: colors.surface || "#2A2A2A",
                border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                borderRadius: "20px",
                padding: "24px",
              }}
            >
              <p style={{ color: colors.text, margin: 0 }}>
                You are not part of any classes yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {classes.map((classItem) => (
                <div
                  key={classItem.class_id}
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
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>{classItem.name}</h3>

                      <p
                        style={{
                          color: colors.text,
                          margin: "8px 0 0",
                          lineHeight: 1.6,
                        }}
                      >
                        {classItem.description || "No description provided."}
                      </p>
                    </div>

                    <div
                      style={{
                        background:
                          classItem.role_in_class === "teacher"
                            ? "rgba(124, 252, 152, 0.15)"
                            : "rgba(255,255,255,0.08)",
                        color:
                          classItem.role_in_class === "teacher"
                            ? "#7CFC98"
                            : colors.text,
                        padding: "8px 12px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        height: "fit-content",
                        textTransform: "capitalize",
                      }}
                    >
                      {classItem.role_in_class}
                    </div>
                  </div>

                  <div style={{ color: colors.text }}>
                    <strong style={{ color: colors.white }}>Join Code:</strong>{" "}
                    <span
                      style={{
                        color: "#7CFC98",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      {classItem.join_code}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      to={`/shared-modules`}
                      style={{
                        background: colors.buttonPrimary,
                        color: colors.white,
                        padding: "12px 16px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      View Shared Modules
                    </Link>

                    <Link
                      to={`/modules`}
                      style={{
                        background: colors.surfaceLight || "#3A3A3A",
                        color: colors.white,
                        padding: "12px 16px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      Explore Public Modules
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}