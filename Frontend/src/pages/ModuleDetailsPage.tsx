import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getExercisesByModuleId, getModuleById } from "../services/modules";
import type { Module } from "../types/module";
import type { Exercise } from "../types/exercise";
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

export default function ModuleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [publishing, setPublishing] = useState(false);

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const isOwner =
    !!currentUser &&
    !!module &&
    typeof module.user_id !== "undefined" &&
    currentUser.user_id === module.user_id;

  useEffect(() => {
    async function loadPageData() {
      if (!id) return;

      try {
        const [moduleData, exerciseData] = await Promise.all([
          getModuleById(id),
          getExercisesByModuleId(id),
        ]);

        setModule(moduleData);
        setExercises(exerciseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load module");
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, [id]);

  async function handlePublishToggle() {
    if (!module || !id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setActionError("You must be logged in to publish a module.");
      return;
    }

    try {
      setPublishing(true);
      setActionError("");
      setActionMessage("");

      const response = await fetch(`http://localhost:3000/modules/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_published: !module.is_published,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to update publish status");
      }

      const updated = JSON.parse(text);
      setModule(updated);
      setActionMessage(
        updated.is_published
          ? "Module published successfully."
          : "Module unpublished successfully."
      );
    } catch (err) {
      console.error(err);
      setActionError(
        err instanceof Error ? err.message : "Failed to update publish status"
      );
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div style={{ color: "black", padding: "2rem" }}>
        Loading module...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "2rem" }}>
        Error: {error}
      </div>
    );
  }

  if (!module) {
    return (
      <div style={{ color: "black", padding: "2rem" }}>
        Module not found.
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
        <Link
          to="/modules"
          style={{
            color: colors.text,
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          ← Back to Modules
        </Link>

        <section
          style={{
            marginTop: "20px",
            background: colors.surface || "#2A2A2A",
            border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
            borderRadius: "20px",
            padding: "24px",
            display: "grid",
            gap: "16px",
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
              <h1 style={{ margin: 0, fontSize: "2.4rem" }}>{module.title}</h1>
              <p
                style={{
                  marginTop: "10px",
                  color: colors.text,
                  lineHeight: 1.6,
                  maxWidth: "760px",
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
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "0.92rem",
              }}
            >
              {module.is_published ? "Published" : "Draft"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              color: colors.text,
            }}
          >
            <span>
              <strong style={{ color: colors.white }}>Category:</strong>{" "}
              {module.category}
            </span>
            <span>•</span>
            <span>
              <strong style={{ color: colors.white }}>Difficulty:</strong>{" "}
              {module.difficulty || "Beginner"}
            </span>
          </div>

          {isOwner && (
            <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: "6px",
            }}
          >
            <button
              onClick={handlePublishToggle}
              disabled={publishing}
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
                opacity: publishing ? 0.7 : 1,
              }}
            >
              {publishing
                ? "Updating..."
                : module.is_published
                ? "Unpublish"
                : "Publish"}
            </button>
          
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
          
            <Link
              to="/my-modules"
              style={{
                color: colors.text,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Manage in My Modules
            </Link>
          </div>
          )}

          {actionMessage && (
            <p style={{ color: "#7CFC98", margin: 0 }}>{actionMessage}</p>
          )}

          {actionError && (
            <p style={{ color: "red", margin: 0, whiteSpace: "pre-wrap" }}>
              {actionError}
            </p>
          )}
        </section>

        <section
          style={{
            marginTop: "28px",
            display: "grid",
            gap: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Exercises</h2>

          {exercises.length === 0 ? (
            <div
              style={{
                background: colors.surface || "#2A2A2A",
                border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                borderRadius: "16px",
                padding: "20px",
                color: colors.text,
              }}
            >
              No exercises available for this module yet.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {exercises.map((exercise) => (
                <div
                  key={exercise.exercise_id}
                  style={{
                    background: colors.surface || "#2A2A2A",
                    border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                    borderRadius: "16px",
                    padding: "18px",
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                    {exercise.title}
                  </h3>

                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: "14px",
                      color: colors.text,
                      lineHeight: 1.6,
                    }}
                  >
                    {exercise.description || "No description yet."}
                  </p>

                  <Link
                    to={`/exercise/${exercise.exercise_id}`}
                    style={{
                      display: "inline-block",
                      background: colors.buttonPrimary,
                      color: colors.white,
                      padding: "10px 14px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Start Exercise
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}