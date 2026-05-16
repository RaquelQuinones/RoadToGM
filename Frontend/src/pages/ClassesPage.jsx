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

export default function ClassesPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUser();
    loadMyClasses();
  }, []);

  function loadUser() {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }

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
        throw new Error(data.error || "Failed to load classes");
      }

      setClasses(data);
    } catch (err) {
      console.error("Error loading classes:", err);
      setError(err.message || "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClass(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to create a class.");
      return;
    }

    if (!form.name.trim()) {
      setError("Class name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:3000/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create class");
      }

      setMessage(`Class "${data.name}" created successfully. Join code: ${data.join_code}`);

      setForm({
        name: "",
        description: "",
      });

      await loadMyClasses();
    } catch (err) {
      console.error("Error creating class:", err);
      setError(err.message || "Failed to create class.");
    } finally {
      setCreating(false);
    }
  }

  const isTeacher = user?.role === "teacher";

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
            <h1 style={{ margin: 0, fontSize: "2.3rem" }}>Classes</h1>
            <p style={{ marginTop: "8px", color: colors.text }}>
              Create class groups and share chess modules with your students.
            </p>
          </div>

          <Link
            to="/my-modules"
            style={{
              background: colors.buttonPrimary,
              color: colors.white,
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Go to My Modules
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

        {!isTeacher && !loading && (
          <section
            style={{
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Teacher Access Required</h2>
            <p style={{ color: colors.text, lineHeight: 1.6 }}>
              Only teacher accounts can create classes. Students can join
              classes from the My Classes page using a join code.
            </p>

            <Link
              to="/my-classes"
              style={{
                display: "inline-block",
                marginTop: "8px",
                background: colors.buttonPrimary,
                color: colors.white,
                padding: "12px 18px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Go to My Classes
            </Link>
          </section>
        )}

        {isTeacher && (
          <section
            style={{
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "28px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Create a Class</h2>

            <form
              onSubmit={handleCreateClass}
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <label>
                Class Name
                <br />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Example: Beginner Chess Club"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    border: "1px solid #555",
                    boxSizing: "border-box",
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
                  placeholder="Optional class description"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    border: "1px solid #555",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={creating}
                style={{
                  background: colors.buttonPrimary,
                  color: colors.white,
                  border: "none",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: creating ? "not-allowed" : "pointer",
                  opacity: creating ? 0.7 : 1,
                  width: "fit-content",
                }}
              >
                {creating ? "Creating Class..." : "Create Class"}
              </button>
            </form>
          </section>
        )}

        <section>
          <h2 style={{ marginBottom: "16px" }}>My Created Classes</h2>

          {loading ? (
            <p style={{ color: colors.text }}>Loading classes...</p>
          ) : classes.filter((classItem) => classItem.role_in_class === "teacher")
              .length === 0 ? (
            <div
              style={{
                background: colors.surface || "#2A2A2A",
                border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                borderRadius: "20px",
                padding: "24px",
              }}
            >
              <p style={{ color: colors.text, margin: 0 }}>
                You have not created any classes yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {classes
                .filter((classItem) => classItem.role_in_class === "teacher")
                .map((classItem) => (
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
                          background: "rgba(124, 252, 152, 0.15)",
                          color: "#7CFC98",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontWeight: 700,
                          height: "fit-content",
                        }}
                      >
                        Teacher
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
                        to={`/my-classes`}
                        style={{
                          background: colors.surfaceLight || "#3A3A3A",
                          color: colors.white,
                          padding: "12px 16px",
                          borderRadius: "12px",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        View My Classes
                      </Link>

                      <Link
                        to={`/my-modules`}
                        style={{
                          background: colors.buttonPrimary,
                          color: colors.white,
                          padding: "12px 16px",
                          borderRadius: "12px",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        Share a Module
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