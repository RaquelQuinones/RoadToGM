import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CBoard from "../components/chess/creationBoard";
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
import AuthStatus from "../components/AuthStatus";

export default function CreateContentPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("exercise");
  const [showModuleModal, setShowModuleModal] = useState(false);

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    category: "Tactics",
    difficulty: "Beginner",
  });

  const [exerciseForm, setExerciseForm] = useState({
    module_id: "",
    title: "",
    description: "",
    difficulty: "Beginner",
    ipos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    solution: ['e2','e4'],
    color: "w",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMyModules();
    }
  }, [currentUser]);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      setCurrentUser(null);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error(text || "Session expired");
      }

      const user = JSON.parse(text);
      setCurrentUser(user);
    } catch (err) {
      console.error("Auth check failed:", err);
      setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function loadMyModules() {
    const token = localStorage.getItem("token");

    try {
      setLoadingModules(true);
      setError("");

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
      setError("Could not load your modules.");
    } finally {
      setLoadingModules(false);
    }
  }

  async function handleCreateModule(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to create a module.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moduleForm),
      });

      const rawText = await response.text();
      console.log("POST /modules status:", response.status);
      console.log("POST /modules raw response:", rawText);

      if (!response.ok) {
        throw new Error(rawText || "Failed to create module");
      }

      const created = JSON.parse(rawText);

      setMessage(`Module "${created.title}" created successfully.`);
      setShowModuleModal(false);

      setModuleForm({
        title: "",
        description: "",
        category: "Tactics",
        difficulty: "Beginner",
      });

      await loadMyModules();

      setExerciseForm((prev) => ({
        ...prev,
        module_id: created.module_id,
      }));
    } catch (err) {
      console.error("handleCreateModule error:", err);
      setError(err.message || "Could not create module.");
    }
  }

  async function handleCreateExercise(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to create an exercise.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...exerciseForm,
          module_id: Number(exerciseForm.module_id),
        }),
      });

      const rawText = await response.text();
      console.log("POST /exercises status:", response.status);
      console.log("POST /exercises raw response:", rawText);

      if (!response.ok) {
        throw new Error(rawText || "Failed to create exercise");
      }

      const created = JSON.parse(rawText);

      setMessage(`Exercise "${created.title}" created successfully.`);

      setExerciseForm({
        module_id: "",
        title: "",
        description: "",
        difficulty: "Beginner",
        ipos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        solution: '["e2e4"]',
        color: "w",
      });
    } catch (err) {
      console.error("handleCreateExercise error:", err);
      setError(err.message || "Could not create exercise.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
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
            <h1 style={{ margin: 0, fontSize: "2.3rem" }}>Create Content</h1>
            <p style={{ marginTop: "8px", color: colors.text }}>
              Create a module or add a new exercise to one of your modules.
            </p>
            {currentUser && (
              <p style={{ marginTop: "8px", color: colors.text }}>
                Logged in as <strong>{currentUser.username}</strong>
              </p>
            )}
          </div>

          {currentUser && (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowModuleModal(true)}
                style={{
                  background: colors.buttonPrimary,
                  color: colors.white,
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + New Module
              </button>

              <button
                onClick={() => setMode("exercise")}
                style={{
                  background:
                    mode === "exercise"
                      ? colors.buttonPrimary
                      : colors.surface || "#2A2A2A",
                  color: colors.white,
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create Exercise
              </button>

              <Link
                to="/my-modules"
                style={{
                  background: colors.surfaceLight || "#3A3A3A",
                  color: colors.white,
                  padding: "12px 18px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Manage My Modules
              </Link>
            </div>
          )}
        </div>

        {isCheckingAuth ? (
          <p style={{ color: colors.text }}>Checking session...</p>
        ) : !currentUser ? (
          <section
            style={{
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              padding: "24px",
              display: "grid",
              gap: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>You need to log in first</h2>
            <p style={{ margin: 0, color: colors.text, lineHeight: 1.6 }}>
              Creating modules and exercises is only available for signed-in users.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/login"
                style={{
                  background: colors.buttonPrimary,
                  color: colors.white,
                  padding: "12px 18px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Go to Login
              </Link>

              <Link
                to="/signup"
                style={{
                  background: colors.surface || "#2A2A2A",
                  color: colors.white,
                  padding: "12px 18px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                  border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                }}
              >
                Create Account
              </Link>
            </div>
          </section>
        ) : (
          <>
            {message && (
              <p style={{ color: "#7CFC98", marginBottom: "16px" }}>{message}</p>
            )}

            {error && (
              <p style={{ color: "red", marginBottom: "16px", whiteSpace: "pre-wrap" }}>
                {error}
              </p>
            )}

            {mode === "exercise" && (
              <section
                style={{
                  background: colors.surface || "#2A2A2A",
                  border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <h2 style={{ marginTop: 0 }}>Create Exercise</h2>

                {loadingModules ? (
                  <p style={{ color: colors.text }}>Loading your modules...</p>
                ) : modules.length === 0 ? (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <p style={{ color: colors.text, margin: 0 }}>
                      You do not have any modules yet. Create one first.
                    </p>
                    <button
                      onClick={() => setShowModuleModal(true)}
                      style={{
                        background: colors.buttonPrimary,
                        color: colors.white,
                        border: "none",
                        padding: "12px 18px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        width: "fit-content",
                      }}
                    >
                      + Create Module
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleCreateExercise}
                    style={{
                      display: "flex",
                      flexDirection:"column",
                      gap: "18px",
                    }}
                  >
                    <div style={{
                      display: 'inline-block',  
                      minWidth: '100%',         
                      height: 'auto',
                      overflow: 'visible'
                    }}>
                    <CBoard />
                    </div>

                    <label>
                      Module
                      <br />
                      <select
                        value={exerciseForm.module_id}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            module_id: e.target.value,
                          })
                        }
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      >
                        <option value="">Select a module</option>
                        {modules.map((module) => (
                          <option key={module.module_id} value={module.module_id}>
                            {module.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Exercise Title
                      <br />
                      <input
                        type="text"
                        value={exerciseForm.title}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            title: e.target.value,
                          })
                        }
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      />
                    </label>

                    <label>
                      Description
                      <br />
                      <textarea
                        value={exerciseForm.description}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      />
                    </label>

                    <label>
                      Difficulty
                      <br />
                      <select
                        value={exerciseForm.difficulty}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            difficulty: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </label>

                    <label>
                      Initial Position (FEN)
                      <br />
                      <input
                        type="text"
                        value={exerciseForm.ipos}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            ipos: e.target.value,
                          })
                        }
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      />
                    </label>

                    <label>
                      Solution
                      <br />
                      <input
                        type="text"
                        value={exerciseForm.solution}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            solution: e.target.value,
                          })
                        }
                        placeholder='Example: ["e2e4"]'
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      />
                    </label>

                    <label>
                      Side to Move
                      <br />
                      <select
                        value={exerciseForm.color}
                        onChange={(e) =>
                          setExerciseForm({
                            ...exerciseForm,
                            color: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                        }}
                      >
                        <option value="w">White</option>
                        <option value="b">Black</option>
                      </select>
                    </label>

                    <button
                      type="submit"
                      style={{
                        background: colors.buttonPrimary,
                        color: colors.white,
                        border: "none",
                        padding: "14px 20px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Save Exercise
                    </button>
                  </form>
                )}
              </section>
            )}
          </>
        )}

        {showModuleModal && currentUser && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "560px",
                background: colors.surface || "#2A2A2A",
                borderRadius: "20px",
                padding: "24px",
                border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <h2 style={{ margin: 0 }}>Create New Module</h2>
                <button
                  onClick={() => setShowModuleModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: colors.white,
                    fontSize: "1.4rem",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleCreateModule}
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                <label>
                  Module Name
                  <br />
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, title: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "8px",
                    }}
                  />
                </label>

                <label>
                  Description
                  <br />
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "8px",
                    }}
                  />
                </label>

                <label>
                  Category
                  <br />
                  <select
                    value={moduleForm.category}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        category: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "8px",
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
                    value={moduleForm.difficulty}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        difficulty: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>

                <button
                  type="submit"
                  style={{
                    background: colors.buttonPrimary,
                    color: colors.white,
                    border: "none",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Module
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}