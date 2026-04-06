const express = require("express");
const cors = require("cors");
const path = require("path");
const { Chess } = require("chess.js");
const pgp = require("pg-promise")();

const db = pgp({
  host: "localhost",
  port: 5431,
  database: "postgres",
  user: "dev_test",
  password: "RoadToTest",
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

const PORT = 3000;

const game = new Chess();
let boardState = game.fen();

// ---------- helpers ----------

const insertExercise = async (exerciseData) => {
  return db.one(
    `
    INSERT INTO exercise (ipos, solution, color)
    VALUES ($(ipos), $(solution), $(color))
    RETURNING exercise_id
    `,
    exerciseData
  );
};

const buildExercise = async (id) => {
  return db.one(
    `
    SELECT * FROM exercise
    WHERE exercise_id = $1
    `,
    [id]
  );
};

// ---------- old/testing routes ----------

app.get("/reset", (req, res) => {
  game.reset();
  boardState = game.fen();
  res.json({ success: true, fen: boardState });
});

app.get("/test", async (req, res) => {
  try {
    console.log("request made");
    const data = await db.any("SELECT * FROM exercise");
    console.log(game.ascii());
    console.log(boardState);
    res.json(data);
  } catch (err) {
    console.error("Error in /test GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/test", (req, res) => {
  try {
    console.log(req.body);
    game.move(req.body);
    console.log(game.history());
    boardState = game.fen();
    res.json({ fen: boardState });
  } catch (err) {
    console.error("Error in /test POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/build", async (req, res) => {
  try {
    const exData = await buildExercise(4);
    res.json(exData);
  } catch (err) {
    console.error("Error in /build:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/create", async (req, res) => {
  try {
    const exData = req.body;
    console.log(exData, "this is it");
    const id = await insertExercise(exData);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error in /create:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- modules routes ----------

app.get("/modules", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM modules ORDER BY module_id ASC");
    res.json(data);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.oneOrNone(
      "SELECT * FROM modules WHERE module_id = $1",
      [id]
    );

    if (!data) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/modules", async (req, res) => {
  try {
    console.log("POST /modules body:", req.body);

    const { title, description, category, difficulty } = req.body;

    const created = await db.one(
      `
      INSERT INTO modules (title, description, category, difficulty)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [title, description, category, difficulty || "Beginner"]
    );

    res.json(created);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- exercises routes ----------

app.get("/exercises/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.oneOrNone(
      `
      SELECT exercise_id, module_id, title, description, difficulty, ipos, solution, color
      FROM exercise
      WHERE exercise_id = $1
      `,
      [id]
    );

    if (!data) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    let parsedSolution = data.solution;
    if (typeof parsedSolution === "string") {
      try {
        parsedSolution = JSON.parse(parsedSolution);
      } catch {
        parsedSolution = [];
      }
    }

    res.json({
      exercise_id: data.exercise_id,
      module_id: data.module_id,
      title: data.title || `Exercise ${data.exercise_id}`,
      description: data.description || "Solve the exercise on the board below.",
      difficulty: data.difficulty || "Beginner",
      initial_fen: data.ipos,
      solution_moves: parsedSolution,
      side_to_move: data.color,
    });
  } catch (err) {
    console.error("Error fetching exercise:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/exercises", async (req, res) => {
  try {
    const {
      module_id,
      title,
      description,
      difficulty,
      ipos,
      solution,
      color,
    } = req.body;

    const created = await db.one(
      `
      INSERT INTO exercise (module_id, title, description, difficulty, ipos, solution, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [
        module_id,
        title,
        description,
        difficulty || "Beginner",
        ipos,
        solution,
        color,
      ]
    );

    res.json(created);
  } catch (err) {
    console.error("Error creating exercise:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/modules/:id/exercises", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.any(
      `
      SELECT *
      FROM exercise
      WHERE module_id = $1
      ORDER BY exercise_id ASC
      `,
      [id]
    );

    res.json(data);
  } catch (err) {
    console.error("Error fetching exercises for module:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- start server ----------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});