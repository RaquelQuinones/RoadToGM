const express = require("express");
const cors = require("cors");
const path = require("path");
const { Chess } = require("chess.js");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { performance } = require('perf_hooks');

const JWT_SECRET = "roadtogm_dev_secret";

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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

async function getOwnedModuleOrReject(moduleId, userId, res) {
  const existing = await db.oneOrNone(
    "SELECT * FROM modules WHERE module_id = $1",
    [moduleId]
  );

  if (!existing) {
    res.status(404).json({ error: "Module not found" });
    return null;
  }

  if (existing.user_id !== userId) {
    res.status(403).json({ error: "You do not own this module" });
    return null;
  }

  return existing;
}

const insertExercise = async (exerciseData) => {
  return db.one(
    `
    INSERT INTO exercise (ipos, solution, color)
    VALUES ($(ipos), $(solution), $(color))
    RETURNING exercise_id
    `,
    exerciseData.exData
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

// ---------- auth routes ----------

app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email, and password are required" });
    }
    const start = performance.now();
    const existing = await db.oneOrNone(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const created = await db.one(
      `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, username, email, role;
      `,
      [username, email, password_hash, role || "student"]
    );
    console.log('/auth/signup POST api call finished in',performance.now() - start,'ms');
    res.json(created);
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const start = performance.now();
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log('/auth/login POST api call finished in',performance.now() - start,'ms');
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const start = performance.now();
    const user = await db.oneOrNone(
      "SELECT user_id, username, email, role FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log('/auth/me GET api call finished in',performance.now() - start,'ms');
    res.json(user);
  } catch (err) {
    console.error("Error in /auth/me:", err);
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/build/:id", async (req, res) => {
  try {
    const start = performance.now();
    const id = req.params.id;
    const exData = await buildExercise(id);
    console.log('/build api call finished in',performance.now(),'ms'); 
    res.json(exData);
  } catch (err) {
    console.error("Error in /build:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/create", async (req, res) => {
  try {
    const start = performance.now();
    const exData = req.body;
    const id = await insertExercise(exData);
    console.log('/create api call finished in',performance.now() - start,'ms');
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error in /create:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- modules routes ----------

app.get("/modules", async (req, res) => {
  try {
    const start = performance.now();
    const data = await db.any(
      "SELECT * FROM modules WHERE is_published = TRUE OR is_published IS NULL ORDER BY module_id ASC"
    );
    console.log('modules GET api call finished in',performance.now() - start,'ms')
    res.json(data);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const start = performance.now();
    const data = await db.oneOrNone(
      "SELECT * FROM modules WHERE module_id = $1",
      [id]
    );

    if (!data) {
      return res.status(404).json({ error: "Module not found" });
    }
    console.log('modules GET api call finished in',performance.now() - start,'ms')
    res.json(data);
  } catch (err) {
    console.error("Error fetching module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/my/modules", authenticateToken, async (req, res) => {
  try {
    const start = performance.now();
    const data = await db.any(
      "SELECT * FROM modules WHERE user_id = $1 ORDER BY module_id ASC",
      [req.user.user_id]
    );
    console.log('/my/modules GET api call finished in',performance.now() - start,'ms')
    res.json(data);
  } catch (err) {
    console.error("Error fetching my modules:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/modules", authenticateToken, async (req, res) => {
  try {
    const { title, description, category, difficulty } = req.body;
    const start = performance.now();
    const created = await db.one(
      `
      INSERT INTO modules (title, description, category, difficulty, user_id, is_published)
      VALUES ($1, $2, $3, $4, $5, FALSE)
      RETURNING *;
      `,
      [title, description, category, difficulty || "Beginner", req.user.user_id]
    );
    console.log('modules POST api call finished in',performance.now() - start,'ms')
    res.json(created);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/modules/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty } = req.body;
    const start = performance.now();
    const existing = await getOwnedModuleOrReject(
      id,
      req.user.user_id,
      res
    );
    if (!existing) return;

    const updated = await db.one(
      `
      UPDATE modules
      SET title = $1,
          description = $2,
          category = $3,
          difficulty = $4
      WHERE module_id = $5
      RETURNING *;
      `,
      [
        title ?? existing.title,
        description ?? existing.description,
        category ?? existing.category,
        difficulty ?? existing.difficulty,
        id,
      ]
    );
    console.log('modules PUT api call finished in',performance.now() - start,'ms')
    res.json(updated);
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.patch("/modules/:id/publish", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;
    const start = performance.now();
    const existing = await getOwnedModuleOrReject(
      id,
      req.user.user_id,
      res
    );
    if (!existing) return;

    const updated = await db.one(
      `
      UPDATE modules
      SET is_published = $1
      WHERE module_id = $2
      RETURNING *;
      `,
      [Boolean(is_published), id]
    );
    console.log('modules/publish PATCH api call finished in',performance.now() - start,'ms')
    res.json(updated);
  } catch (err) {
    console.error("Error publishing module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/modules/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const start = performance.now();
    const existing = await getOwnedModuleOrReject(
      id,
      req.user.user_id,
      res
    );
    if (!existing) return;

    // Delete exercises that belong to this module first
    await db.none("DELETE FROM exercise WHERE module_id = $1", [id]);

    // Then delete the module
    await db.none("DELETE FROM modules WHERE module_id = $1", [id]);
    console.log('modules DELETE api call finished in',performance.now() - start,'ms')
    res.json({ success: true, message: "Module and its exercises deleted" });
  } catch (err) {
    console.error("Error deleting module:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- exercises routes ----------

app.get("/exercises/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const start = performance.now();
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
    console.log('exercise GET api call finished in',performance.now() - start,'ms')
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

app.post("/exercises", authenticateToken, async (req, res) => {
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

    const start = performance.now();
    const moduleRecord = await db.oneOrNone(
      "SELECT * FROM modules WHERE module_id = $1",
      [module_id]
    );

    if (!moduleRecord) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (moduleRecord.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "You do not own this module" });
    }

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
    console.log('/exercises POST api call finished in',performance.now() - start,'ms');
    res.json(created);
  } catch (err) {
    console.error("Error creating exercise:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/exercises/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      module_id,
      title,
      description,
      difficulty,
      ipos,
      solution,
      color,
    } = req.body;

    const start = performance.now();
    const existing = await db.oneOrNone(
      "SELECT * FROM exercise WHERE exercise_id = $1",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const moduleRecord = await db.oneOrNone(
      "SELECT * FROM modules WHERE module_id = $1",
      [existing.module_id]
    );

    if (!moduleRecord || moduleRecord.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "You do not own this exercise" });
    }

    const updated = await db.one(
      `
      UPDATE exercise
      SET module_id = $1,
          title = $2,
          description = $3,
          difficulty = $4,
          ipos = $5,
          solution = $6,
          color = $7
      WHERE exercise_id = $8
      RETURNING *;
      `,
      [
        module_id ?? existing.module_id,
        title ?? existing.title,
        description ?? existing.description,
        difficulty ?? existing.difficulty,
        ipos ?? existing.ipos,
        typeof solution === "undefined"
          ? existing.solution
          : typeof solution === "string"
          ? solution
          : JSON.stringify(solution),
        color ?? existing.color,
        id,
      ]
    );
    console.log('/exercises PUT api call finished in',performance.now() - start,'ms');
    res.json(updated);
  } catch (err) {
    console.error("Error updating exercise:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/exercises/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const start = performance.now();
    const existing = await db.oneOrNone(
      "SELECT * FROM exercise WHERE exercise_id = $1",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const moduleRecord = await db.oneOrNone(
      "SELECT * FROM modules WHERE module_id = $1",
      [existing.module_id]
    );

    if (!moduleRecord || moduleRecord.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "You do not own this exercise" });
    }

    await db.none("DELETE FROM exercise WHERE exercise_id = $1", [id]);
    console.log('/exercises DELETE api call finished in',performance.now() - start,'ms');
    res.json({ success: true, message: "Exercise deleted" });
  } catch (err) {
    console.error("Error deleting exercise:", err);
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