//This is for exercises the base of it and change it with the ID

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExerciseBoard from "../../components/chess/exerciseBoard";
import { getExerciseById } from "../../services/exercises";
import type { Exercise } from "../../types/exercise";

// export default function ExercisePage() {
//     return (
//       <div style={{ color: "black", background: "white", padding: "2rem" }}>
//         <h1>Exercise page is rendering</h1>
//       </div>
//     );
//   }

export default function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading exercise...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!exercise) return <p>Exercise not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to={exercise.module_id ? `/modules/${exercise.module_id}` : "/modules"}>
        ← Back
      </Link>

      <h1 style={{ marginTop: "1rem" }}>{exercise.title}</h1>
      <p>{exercise.description || "Solve the exercise on the board below."}</p>

      <ExerciseBoard
        initialFen={exercise.initial_fen}
        solutionMoves={exercise.solution_moves}
        sideToMove={exercise.side_to_move}
      />
    </div>
  );
}