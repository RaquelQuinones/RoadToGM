import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createModule } from "../services/modules";

export default function CreateModulePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tactics");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const createdModule = await createModule({
        title,
        description,
        category,
      });

      navigate(`/modules/${createdModule.module_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create module");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Create Module</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label htmlFor="title">Title</label>
          <br />
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <br />
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="openings">Openings</option>
            <option value="tactics">Tactics</option>
            <option value="strategy">Strategy</option>
            <option value="endgames">Endgames</option>
          </select>
        </div>

        {error && <p>Error: {error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Module"}
        </button>
      </form>
    </div>
  );
}