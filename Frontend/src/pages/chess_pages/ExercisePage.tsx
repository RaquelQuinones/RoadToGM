import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExerciseBoard from "../../components/chess/exerciseBoard";
import { getExerciseById } from "../../services/exercises";
import type { Exercise } from "../../types/exercise";

import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  UpperBarButton,
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

  const currentExerciseId = Number(id || 1);
  const nextExerciseId = currentExerciseId + 1;
  const previousExerciseId = Math.max(1, currentExerciseId - 1);

  useEffect(() => {
    async function loadExercise() {
      if (!id) return;

      try {
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
            <div
              style={{
                marginBottom: "18px",
              }}
            >
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
                      {exercise.side_to_move === "w" ? "White" : "Black"}
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
                      Beginner
                    </div>
                  </div>
                </div>

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
                  <ExerciseBoard/>
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
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ color: colors.white, fontSize: "1.1rem", fontWeight: 700 }}>
                      Exercise {exercise.exercise_id ?? currentExerciseId}
                    </div>
                    <div style={{ color: colors.text, marginTop: "6px", fontSize: "15px" }}>
                      Continue solving focused training positions.
                    </div>
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ color: colors.white, fontSize: "1.1rem", fontWeight: 700 }}>
                      Category
                    </div>
                    <div style={{ color: colors.text, marginTop: "6px", fontSize: "15px" }}>
                      Tactics
                    </div>
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ color: colors.white, fontSize: "1.1rem", fontWeight: 700 }}>
                      Side to move
                    </div>
                    <div style={{ color: colors.text, marginTop: "6px", fontSize: "15px" }}>
                      {exercise.side_to_move === "w" ? "White" : "Black"}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                      borderRadius: "16px",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ color: colors.white, fontSize: "1.1rem", fontWeight: 700 }}>
                      Difficulty
                    </div>
                    <div style={{ color: colors.text, marginTop: "6px", fontSize: "15px" }}>
                      Beginner
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