// src/components/ExerciseCompleteCard.tsx

type ExerciseCompleteCardProps = {
    show: boolean;
    onNextExercise?: () => void;
    onBackToModule?: () => void;
  };
  
  export default function ExerciseCompleteCard({
    show,
    onNextExercise,
    onBackToModule,
  }: ExerciseCompleteCardProps) {
    if (!show) return null;
  
    return (
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: "16px",
          backgroundColor: "#eef6ec",
          border: "1px solid #b7d3b2",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: "0 0 0.5rem 0",
            color: "#345c38",
          }}
        >
          Exercise Completed!
        </h2>
  
        <p
          style={{
            margin: "0 0 1rem 0",
            color: "#4f674f",
          }}
        >
          Great job! You completed all the moves for this exercise.
        </p>
  
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {onNextExercise && (
            <button
              onClick={onNextExercise}
              style={{
                padding: "0.65rem 1rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#6f8f72",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Next Exercise
            </button>
          )}
  
          {onBackToModule && (
            <button
              onClick={onBackToModule}
              style={{
                padding: "0.65rem 1rem",
                borderRadius: "10px",
                border: "1px solid #6f8f72",
                backgroundColor: "white",
                color: "#345c38",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Module
            </button>
          )}
        </div>
      </div>
    );
  }