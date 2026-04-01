import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getExercisesByModuleId, getModuleById } from "../services/modules";
import type { Module } from "../types/module";
import type { Exercise } from "../types/exercise";

export default function ModuleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading module...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!module) return <p>Module not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/modules">← Back to Modules</Link>

      <h1 style={{ marginTop: "1rem" }}>{module.title}</h1>
      <p>{module.description}</p>
      <p>
        <strong>Category:</strong> {module.category}
      </p>

      <h2 style={{ marginTop: "2rem" }}>Exercises</h2>

      {exercises.length === 0 ? (
        <p>No exercises available for this module yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {exercises.map((exercise) => (
            <div
              key={exercise.exercise_id}
              style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem" }}
            >
              <h3>{exercise.title}</h3>
              <p>{exercise.description || "No description yet."}</p>
              <Link to={`/exercise/${exercise.exercise_id}`}>Start Exercise</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}