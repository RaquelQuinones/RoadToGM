// src/components/ModuleProgressTracker.tsx

import { useEffect, useState } from "react";

type ModuleProgress = {
  module_id: number;
  module_title: string;
  category: string;
  total_exercises: number;
  completed_exercises: number;
  progress_percentage: string | number;
};

type ModuleProgressTrackerProps = {
  moduleId: number;
};

export default function ModuleProgressTracker({
  moduleId,
}: ModuleProgressTrackerProps) {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3000/progress/modules/${moduleId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        setLoading(false);
        return;
      }

      setProgress(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching module progress:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [moduleId]);

  if (loading) {
    return <p>Loading progress...</p>;
  }

  if (!progress) {
    return <p>No progress available.</p>;
  }

  const percentage = Number(progress.progress_percentage);

  return (
    <div
      style={{
        backgroundColor: "#f7f3ee",
        border: "1px solid #d8cfc3",
        borderRadius: "16px",
        padding: "1rem",
        width: "100%",
        maxWidth: "450px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 0.5rem 0",
          color: "#2f2f2f",
        }}
      >
        Module Progress
      </h3>

      <p
        style={{
          margin: "0 0 0.25rem 0",
          fontWeight: 600,
          color: "#3d352e",
        }}
      >
        {progress.module_title}
      </p>

      <p
        style={{
          margin: "0 0 0.75rem 0",
          color: "#6f6258",
          fontSize: "0.95rem",
        }}
      >
        {progress.completed_exercises} / {progress.total_exercises} exercises
        completed
      </p>

      <div
        style={{
          width: "100%",
          height: "14px",
          backgroundColor: "#ddd3c7",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#6f8f72",
            borderRadius: "999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <p
        style={{
          margin: "0.5rem 0 0 0",
          color: "#3d352e",
          fontWeight: 600,
        }}
      >
        {percentage}% completed
      </p>
    </div>
  );
}