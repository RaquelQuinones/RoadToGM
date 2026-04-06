import { useEffect, useState } from "react";
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

export default function CreateContentPage() {
  const [mode, setMode] = useState("exercise");
  const [showModuleModal, setShowModuleModal] = useState(false);

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

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
    solution: "",
    color: "w",
  });

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      setLoadingModules(true);
      const response = await fetch("http://localhost:3000/modules");
      if (!response.ok) throw new Error("Failed to load modules");
      const data = await response.json();
      setModules(data);
    } catch (err) {
      console.error(err);
      setError("Could not load modules.");
    } finally {
      setLoadingModules(false);
    }
  }

  async function handleCreateModule(e) {
    e.preventDefault();
    console.log("SAVE MODULE CLICKED");
    console.log("moduleForm:", moduleForm);
  
    setError("");
    setMessage("");
  
    try {
      const response = await fetch("http://localhost:3000/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
  
      await loadModules();
  
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

    try {
      const response = await fetch("http://localhost:3000/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...exerciseForm,
          module_id: Number(exerciseForm.module_id),
        }),
      });

      if (!response.ok) throw new Error("Failed to create exercise");

      const created = await response.json();

      setMessage(`Exercise "${created.title}" created successfully.`);

      setExerciseForm({
        module_id: "",
        title: "",
        description: "",
        difficulty: "Beginner",
        ipos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        solution: "",
        color: "w",
      });
    } catch (err) {
      console.error(err);
      setError("Could not create exercise.");
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
          <UpperBarButton onClick={() => console.log("login")}>
            Login
          </UpperBarButton>

          <UpperBarButton variant="filled" onClick={() => console.log("signup")}>
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
          </div>

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
                background: mode === "exercise" ? colors.buttonPrimary : colors.surface,
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
          </div>
        </div>

        {message && (
          <p style={{ color: "#7CFC98", marginBottom: "16px" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
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
              <p style={{ color: colors.text }}>Loading modules...</p>
            ) : (
              <form
                onSubmit={handleCreateExercise}
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >
                <label>
                  Module
                  <br />
                  <select
                    value={exerciseForm.module_id}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, module_id: e.target.value })
                    }
                    required
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
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
                      setExerciseForm({ ...exerciseForm, title: e.target.value })
                    }
                    required
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Description
                  <br />
                  <textarea
                    value={exerciseForm.description}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, description: e.target.value })
                    }
                    rows={4}
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Difficulty
                  <br />
                  <select
                    value={exerciseForm.difficulty}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, difficulty: e.target.value })
                    }
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
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
                      setExerciseForm({ ...exerciseForm, ipos: e.target.value })
                    }
                    required
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Solution Moves
                  <br />
                  <input
                    type="text"
                    value={exerciseForm.solution}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, solution: e.target.value })
                    }
                    placeholder='Example: ["e2e4","e7e5"]'
                    required
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Side to Move
                  <br />
                  <select
                    value={exerciseForm.color}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, color: e.target.value })
                    }
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
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

        {showModuleModal && (
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
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Description
                  <br />
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, description: e.target.value })
                    }
                    rows={4}
                    required
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
                  />
                </label>

                <label>
                  Category
                  <br />
                  <select
                    value={moduleForm.category}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, category: e.target.value })
                    }
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
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
                      setModuleForm({ ...moduleForm, difficulty: e.target.value })
                    }
                    style={{ width: "100%", padding: "12px", marginTop: "8px" }}
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