import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExerciseBoard from "../../components/chess/exerciseBoard";
import { getExerciseById } from "../../services/exercises";
import type { Exercise } from "../../types/exercise";
import ModuleProgressTracker from "../../components/ModulesTracker";
import CompleteCard from "../../components/Complete";

import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  DropdownBar,
} from "../../components/UpperBar";
import Logo from "../../images/Logo.png";
import { colors } from "../../palette/color.js";
import AuthStatus from "../../components/AuthStatus";

export default function ExercisePage() {
  const { id } = useParams<{ id: string }>();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isExerciseDone, setIsExerciseDone] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);
  const [progressRefreshKey, setProgressRefreshKey] = useState(0);

  const currentExerciseId = Number(id || 1);
  const nextExerciseId = currentExerciseId + 1;
  const previousExerciseId = Math.max(1, currentExerciseId - 1);

  const solutionMoves = useMemo(() => {
    if (!exercise) return [];

    const rawSolution = exercise.solution_moves || exercise.solution || [];

    if (Array.isArray(rawSolution)) {
      return rawSolution;
    }

    if (typeof rawSolution === "string") {
      try {
        const parsed = JSON.parse(rawSolution);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return rawSolution
          .replace("{", "")
          .replace("}", "")
          .split(",")
          .map((move) => move.trim())
          .filter(Boolean);
      }
    }

    return [];
  }, [exercise]);

  const sideToMove =
    exercise?.side_to_move === "w" ||
    exercise?.side_to_move === false ||
    exercise?.color === false
      ? "White"
      : "Black";

  useEffect(() => {
    async function loadExercise() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        setExercise(null);
        setIsExerciseDone(false);
        setMoveIndex(0);

        const data = await getExerciseById(id);
        setExercise(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exercise");
      } finally {
        setLoading(false);
      }
    }

    loadExercise();
  }, [id]);

  const markExerciseProgress = async (movesCompleted: number) => {
    if (!exercise) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/progress/exercises/${exercise.exercise_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            moves_completed: movesCompleted,
            total_moves: solutionMoves.length,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      if (data.progress?.is_done) {
        setIsExerciseDone(true);
        setProgressRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error saving exercise progress:", error);
    }
  };

  const markExerciseComplete = async () => {
    if (!exercise) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/progress/exercises/${exercise.exercise_id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            total_moves: solutionMoves.length,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      setIsExerciseDone(true);
      setMoveIndex(solutionMoves.length);
      setProgressRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error marking exercise complete:", error);
    }
  };

  const handleCorrectMove = async () => {
    if (isExerciseDone) return;

    const nextMoveIndex = moveIndex + 1;
    setMoveIndex(nextMoveIndex);

    if (nextMoveIndex >= solutionMoves.length) {
      await markExerciseComplete();
    } else {
      await markExerciseProgress(nextMoveIndex);
    }
  };

  const handleExerciseComplete = async () => {
    if (isExerciseDone) return;

    setMoveIndex(solutionMoves.length);
    await markExerciseComplete();
  };

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
          <UpperBarLogo onClick={() => console.log("logo click")}>
            <img
              src={Logo}
              alt="Road To GM Logo"
              style={{ height: "36px", objectFit: "contain" }}
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
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          padding: "32px 20px 48px",
          maxWidth: "1500px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {loading && (
          <p style={{ color: colors.white, fontSize: "18px" }}>
            Loading exercise...
          </p>
        )}

        {error && (
          <p style={{ color: "red", fontSize: "18px" }}>
            Error: {error}
          </p>
        )}

        {!loading && !error && !exercise && (
          <p style={{ color: colors.white, fontSize: "18px" }}>
            Exercise not found.
          </p>
        )}

        {!loading && !error && exercise && (
          <>
            <div style={{ marginBottom: "18px" }}>
              <Link
                to={exercise.module_id ? `/modules/${exercise.module_id}` : "/modules"}
                style={{
                  color: colors.text,
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                ← Back to Modules
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.3fr) minmax(320px, 0.9fr)",
                gap: "28px",
                alignItems: "start",
              }}
            >
              <section
                style={{
                  background: colors.surface || "#2A2A2A",
                  border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                  borderRadius: "20px",
                  padding: "24px",
                  boxSizing: "border-box",
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    marginBottom: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Exercise {exercise.exercise_id ?? currentExerciseId}
                  </p>

                  <h1
                    style={{
                      margin: 0,
                      color: colors.white,
                      fontSize: "clamp(2rem, 3vw, 3rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {exercise.title}
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: "16px",
                      lineHeight: 1.5,
                    }}
                  >
                    {exercise.description || "Solve the exercise on the board below."}
                  </p>
                </div>

                <div
                  style={{
                    marginBottom: "18px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: colors.background,
                      borderRadius: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.text,
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Side to move
                    </div>

                    <div
                      style={{
                        color: colors.white,
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                    >
                      {sideToMove}
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.background,
                      borderRadius: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.text,
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Category
                    </div>

                    <div
                      style={{
                        color: colors.white,
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                    >
                      Tactics
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.background,
                      borderRadius: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.text,
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Difficulty
                    </div>

                    <div
                      style={{
                        color: colors.white,
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                    >
                      {exercise.difficulty || "Beginner"}
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.background,
                      borderRadius: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.text,
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      Status
                    </div>

                    <div
                      style={{
                        color: isExerciseDone ? "#8fd18f" : colors.white,
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                    >
                      {isExerciseDone ? "Completed" : "In Progress"}
                    </div>
                  </div>
                </div>

                {isExerciseDone && (
                  <div style={{ marginBottom: "18px" }}>
                    <CompleteCard
                      show={isExerciseDone}
                      onNextExercise={() => {
                        window.location.href = `/exercise/${nextExerciseId}`;
                      }}
                      onBackToModule={() => {
                        window.location.href = exercise.module_id
                          ? `/modules/${exercise.module_id}`
                          : "/modules";
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "980px",
                    }}
                  >
                    <ExerciseBoard
                      exercise={exercise}
                      solutionMoves={solutionMoves}
                      moveIndex={moveIndex}
                      isExerciseDone={isExerciseDone}
                      onCorrectMove={handleCorrectMove}
                      onExerciseComplete={handleExerciseComplete}
                    />
                  </div>
                </div>
              </section>

              <aside
                style={{
                  background: colors.surface || "#2A2A2A",
                  border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                  borderRadius: "20px",
                  padding: "24px",
                  color: colors.white,
                  boxSizing: "border-box",
                  position: "sticky",
                  top: "24px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "2rem",
                    lineHeight: 1.1,
                    textAlign: "center",
                  }}
                >
                  Train
                </h2>

                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                  }}
                >
                  {exercise.module_id && (
                    <ModuleProgressTracker
                      moduleId={exercise.module_id}
                      refreshKey={progressRefreshKey}
                    />
                  )}

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.white,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      Exercise {exercise.exercise_id ?? currentExerciseId}
                    </div>

                    <div
                      style={{
                        color: colors.text,
                        marginTop: "6px",
                        fontSize: "15px",
                      }}
                    >
                      Continue solving focused training positions.
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.white,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      Current Progress
                    </div>

                    <div
                      style={{
                        color: colors.text,
                        marginTop: "6px",
                        fontSize: "15px",
                      }}
                    >
                      {moveIndex} / {solutionMoves.length} moves completed
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.white,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      Side to move
                    </div>

                    <div
                      style={{
                        color: colors.text,
                        marginTop: "6px",
                        fontSize: "15px",
                      }}
                    >
                      {sideToMove}
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        color: colors.white,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      Difficulty
                    </div>

                    <div
                      style={{
                        color: colors.text,
                        marginTop: "6px",
                        fontSize: "15px",
                      }}
                    >
                      {exercise.difficulty || "Beginner"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <Link
                      to={`/exercise/${nextExerciseId}`}
                      style={{
                        background: colors.buttonPrimary,
                        color: colors.white,
                        padding: "14px 18px",
                        borderRadius: "14px",
                        textDecoration: "none",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      Next Exercise
                    </Link>

                    <Link
                      to={`/exercise/${previousExerciseId}`}
                      style={{
                        background: colors.background,
                        color: colors.white,
                        padding: "14px 18px",
                        borderRadius: "14px",
                        textDecoration: "none",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      Previous Exercise
                    </Link>

                    <Link
                      to="/modules"
                      style={{
                        color: colors.text,
                        textDecoration: "none",
                        textAlign: "center",
                        fontSize: "15px",
                        marginTop: "4px",
                      }}
                    >
                      Browse all modules
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}