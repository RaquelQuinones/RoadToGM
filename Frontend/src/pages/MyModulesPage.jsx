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
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Keeps share inputs separated by module_id
  const [shareForms, setShareForms] = useState({});

  useEffect(() => {
    loadUser();
    loadMyModules();
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

  function updateShareForm(moduleId, field, value) {
    setShareForms((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  }

  function getShareForm(moduleId) {
    return (
      shareForms[moduleId] || {
        email: "",
        class_id: "",
      }
    );
  }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load your modules");
      }

      setModules(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load your modules.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMyClasses() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/my/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Do not block the modules page if classes fail to load
        console.error(data.error || "Failed to load classes");
        return;
      }

      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes:", err);
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

      const updated = await response.json();

      if (!response.ok) {
        throw new Error(updated.error || "Failed to update publish status");
      }

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

  async function handleShareWithUser(moduleId, moduleTitle) {
    const token = localStorage.getItem("token");
    const form = getShareForm(moduleId);

    if (!token) {
      setError("You must be logged in to share a module.");
      return;
    }

    if (!form.email || !form.email.trim()) {
      setError("Please enter the email of the user you want to share with.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:3000/modules/${moduleId}/share/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: form.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share module with user");
      }

      updateShareForm(moduleId, "email", "");

      setMessage(`"${moduleTitle}" was shared with ${form.email.trim()}.`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to share module with user.");
    }
  }

  async function handleShareWithClass(moduleId, moduleTitle) {
    const token = localStorage.getItem("token");
    const form = getShareForm(moduleId);

    if (!token) {
      setError("You must be logged in to share a module.");
      return;
    }

    if (!form.class_id) {
      setError("Please select a class to share this module with.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:3000/modules/${moduleId}/share/class`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            class_id: Number(form.class_id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share module with class");
      }

      const selectedClass = classes.find(
        (classItem) => String(classItem.class_id) === String(form.class_id)
      );

      updateShareForm(moduleId, "class_id", "");

      setMessage(
        `"${moduleTitle}" was shared with ${
          selectedClass ? selectedClass.name : "the selected class"
        }.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to share module with class.");
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
              { label: "Shared Modules", href: "/shared-modules" },
              { label: "Classes", href: "/classes" },
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
              View, edit, publish, and share the modules you created.
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
          <p
            style={{
              color: "red",
              marginBottom: "16px",
              whiteSpace: "pre-wrap",
            }}
          >
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
            {modules.map((module) => {
              const shareForm = getShareForm(module.module_id);

              return (
                <div
                  key={module.module_id}
                  style={{
                    background: colors.surface || "#2A2A2A",
                    border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                    borderRadius: "18px",
                    padding: "20px",
                    display: "grid",
                    gap: "14px",
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
                    <strong style={{ color: colors.white }}>
                      Difficulty:
                    </strong>{" "}
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
                        handlePublishToggle(
                          module.module_id,
                          module.is_published
                        )
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
                        border: `1px solid ${
                          colors.surfaceLight || "#3A3A3A"
                        }`,
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

                  <section
                    style={{
                      borderTop: `1px solid ${
                        colors.surfaceLight || "#3A3A3A"
                      }`,
                      paddingTop: "14px",
                      display: "grid",
                      gap: "12px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                      }}
                    >
                      Share Module
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Share with user email"
                        value={shareForm.email || ""}
                        onChange={(e) =>
                          updateShareForm(
                            module.module_id,
                            "email",
                            e.target.value
                          )
                        }
                        style={{
                          minWidth: "260px",
                          flex: "1",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid #555",
                        }}
                      />

                      <button
                        onClick={() =>
                          handleShareWithUser(module.module_id, module.title)
                        }
                        style={{
                          background: colors.buttonPrimary,
                          color: colors.white,
                          border: "none",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Share with User
                      </button>
                    </div>

                    {isTeacher && (
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <select
                          value={shareForm.class_id || ""}
                          onChange={(e) =>
                            updateShareForm(
                              module.module_id,
                              "class_id",
                              e.target.value
                            )
                          }
                          style={{
                            minWidth: "260px",
                            flex: "1",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #555",
                          }}
                        >
                          <option value="">Select a class</option>
                          {classes
                            .filter(
                              (classItem) =>
                                classItem.role_in_class === "teacher"
                            )
                            .map((classItem) => (
                              <option
                                key={classItem.class_id}
                                value={classItem.class_id}
                              >
                                {classItem.name} — Code: {classItem.join_code}
                              </option>
                            ))}
                        </select>

                        <button
                          onClick={() =>
                            handleShareWithClass(
                              module.module_id,
                              module.title
                            )
                          }
                          style={{
                            background: colors.surfaceLight || "#3A3A3A",
                            color: colors.white,
                            border: "none",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Share with Class
                        </button>
                      </div>
                    )}

                    {isTeacher && classes.length === 0 && (
                      <p
                        style={{
                          color: colors.text,
                          margin: 0,
                          fontSize: "0.9rem",
                        }}
                      >
                        You do not have any classes yet. Create a class before
                        sharing modules with a class.
                      </p>
                    )}
                  </section>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}