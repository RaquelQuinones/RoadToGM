import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getModules } from "../services/modules";
import type { Module } from "../types/module";

// export default function ModulesPage() {
//   return (
//     <div style={{ color: "black", background: "white", padding: "2rem" }}>
//       <h1>Modules page is rendering</h1>
//     </div>
//   );
// }

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModules() {
      try {
        const data = await getModules();
        setModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load modules");
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, []);

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modules</h1>
        <Link to="/create-module">Create Module</Link>
      </div>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        {modules.map((module) => (
          <div
            key={module.module_id}
            style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem" }}
          >
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <p>
              <strong>Category:</strong> {module.category}
            </p>
            <Link to={`/modules/${module.module_id}`}>Open Module</Link>
          </div>
        ))}
      </div>
    </div>
  );
}