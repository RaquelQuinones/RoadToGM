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

// Optional auth helper for routes that can be public,
// but should know the user if a token is provided.
function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  });
}

// Role-based access helper.
// Example usage:
// app.post("/classes", authenticateToken, requireRole("teacher"), async ...)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action",
      });
    }

    next();
  };
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

// Checks if the logged-in user can access a module.
// Access is allowed if:
// 1. The module is published
// 2. The user owns the module
// 3. The module was shared directly with the user
// 4. The module was shared with a class the user belongs to
async function canUserAccessModule(moduleId, userId) {
  const moduleRecord = await db.oneOrNone(
    "SELECT * FROM modules WHERE module_id = $1",
    [moduleId]
  );

  if (!moduleRecord) {
    return { allowed: false, moduleRecord: null };
  }

  if (moduleRecord.is_published === true || moduleRecord.is_published === null) {
    return { allowed: true, moduleRecord };
  }

  if (!userId) {
    return { allowed: false, moduleRecord };
  }

  if (moduleRecord.user_id === userId) {
    return { allowed: true, moduleRecord };
  }

  const sharedRecord = await db.oneOrNone(
    `
    SELECT sm.shared_module_id
    FROM shared_modules sm
    LEFT JOIN class_members cm ON cm.class_id = sm.class_id
    WHERE sm.module_id = $1
      AND (
        sm.shared_with_user_id = $2
        OR cm.user_id = $2
      )
    LIMIT 1;
    `,
    [moduleId, userId]
  );

  if (sharedRecord) {
    return { allowed: true, moduleRecord };
  }

  return { allowed: false, moduleRecord };
}

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
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

    const allowedRoles = ["student", "teacher"];
    const safeRole = allowedRoles.includes(role) ? role : "student";

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
      [username, email, password_hash, safeRole]
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

    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

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
      `
      SELECT *
      FROM modules
      WHERE is_published = TRUE OR is_published IS NULL
      ORDER BY module_id ASC;
      `
    );

    res.json(data);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: err.message });
  }
});

// This route now protects private modules.
// Public modules can still be opened by anyone.
// Private modules can only be opened by the owner or shared users/classes.
app.get("/modules/:id", optionalAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.user_id : null;

    const access = await canUserAccessModule(id, userId);

    if (!access.moduleRecord) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (!access.allowed) {
      return res.status(403).json({
        error: "You do not have access to this module",
      });
    }

    res.json(access.moduleRecord);
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

// Students and teachers can create modules.
// If you want ONLY teachers to create modules, change this to:
// app.post("/modules", authenticateToken, requireRole("teacher"), async ...)
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

    const existing = await getOwnedModuleOrReject(id, req.user.user_id, res);
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

    const existing = await getOwnedModuleOrReject(id, req.user.user_id, res);
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

    const existing = await getOwnedModuleOrReject(id, req.user.user_id, res);
    if (!existing) return;

    await db.none("DELETE FROM shared_modules WHERE module_id = $1", [id]);

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

// ---------- class / group routes ----------

// Teacher creates a class/group.
app.post(
  "/classes",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Class name is required" });
      }

      let joinCode = generateJoinCode();

      let existingCode = await db.oneOrNone(
        "SELECT class_id FROM classes WHERE join_code = $1",
        [joinCode]
      );

      while (existingCode) {
        joinCode = generateJoinCode();
        existingCode = await db.oneOrNone(
          "SELECT class_id FROM classes WHERE join_code = $1",
          [joinCode]
        );
      }

      const createdClass = await db.one(
        `
        INSERT INTO classes (name, description, join_code, teacher_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [name, description || "", joinCode, req.user.user_id]
      );

      await db.none(
        `
        INSERT INTO class_members (class_id, user_id, role_in_class)
        VALUES ($1, $2, 'teacher')
        ON CONFLICT (class_id, user_id) DO NOTHING;
        `,
        [createdClass.class_id, req.user.user_id]
      );

      res.json(createdClass);
    } catch (err) {
      console.error("Error creating class:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Logged-in user joins a class/group using join code.
app.post("/classes/join", authenticateToken, async (req, res) => {
  try {
    const { join_code } = req.body;

    if (!join_code) {
      return res.status(400).json({ error: "join_code is required" });
    }

    const classRecord = await db.oneOrNone(
      "SELECT * FROM classes WHERE join_code = $1",
      [join_code]
    );

    if (!classRecord) {
      return res.status(404).json({ error: "Class not found" });
    }

    const roleInClass =
      classRecord.teacher_id === req.user.user_id ? "teacher" : "student";

    await db.none(
      `
      INSERT INTO class_members (class_id, user_id, role_in_class)
      VALUES ($1, $2, $3)
      ON CONFLICT (class_id, user_id) DO NOTHING;
      `,
      [classRecord.class_id, req.user.user_id, roleInClass]
    );

    res.json({
      success: true,
      message: "Joined class successfully",
      class: classRecord,
    });
  } catch (err) {
    console.error("Error joining class:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get classes where the logged-in user is a member.
app.get("/my/classes", authenticateToken, async (req, res) => {
  try {
    const classes = await db.any(
      `
      SELECT c.*, cm.role_in_class
      FROM class_members cm
      JOIN classes c ON c.class_id = cm.class_id
      WHERE cm.user_id = $1
      ORDER BY c.class_id ASC;
      `,
      [req.user.user_id]
    );

    res.json(classes);
  } catch (err) {
    console.error("Error fetching my classes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get members of a class.
// Only the teacher who owns the class can see this.
app.get(
  "/classes/:classId/members",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const { classId } = req.params;

      const classRecord = await db.oneOrNone(
        "SELECT * FROM classes WHERE class_id = $1 AND teacher_id = $2",
        [classId, req.user.user_id]
      );

      if (!classRecord) {
        return res.status(403).json({
          error: "You can only view members of classes you own",
        });
      }

      const members = await db.any(
        `
        SELECT u.user_id, u.username, u.email, u.role, cm.role_in_class, cm.joined_at
        FROM class_members cm
        JOIN users u ON u.user_id = cm.user_id
        WHERE cm.class_id = $1
        ORDER BY u.username ASC;
        `,
        [classId]
      );

      res.json(members);
    } catch (err) {
      console.error("Error fetching class members:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ---------- shared module routes ----------

// Share a module with a class.
// Only teachers can share to a class, and they must own both:
// 1. the module
// 2. the class
app.post(
  "/modules/:id/share/class",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { class_id } = req.body;

      if (!class_id) {
        return res.status(400).json({ error: "class_id is required" });
      }

      const moduleRecord = await getOwnedModuleOrReject(
        id,
        req.user.user_id,
        res
      );
      if (!moduleRecord) return;

      const classRecord = await db.oneOrNone(
        "SELECT * FROM classes WHERE class_id = $1 AND teacher_id = $2",
        [class_id, req.user.user_id]
      );

      if (!classRecord) {
        return res.status(403).json({
          error: "You can only share modules with classes you own",
        });
      }

      const shared = await db.one(
        `
        INSERT INTO shared_modules (module_id, class_id, shared_by_user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [id, class_id, req.user.user_id]
      );

      res.json(shared);
    } catch (err) {
      console.error("Error sharing module with class:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Share a module directly with another user by email.
// This allows teacher/student creators to share one-to-one.
app.post("/modules/:id/share/user", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const moduleRecord = await getOwnedModuleOrReject(
      id,
      req.user.user_id,
      res
    );
    if (!moduleRecord) return;

    const targetUser = await db.oneOrNone(
      "SELECT user_id, username, email FROM users WHERE email = $1",
      [email]
    );

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (targetUser.user_id === req.user.user_id) {
      return res.status(400).json({
        error: "You cannot share a module with yourself",
      });
    }

    const shared = await db.one(
      `
      INSERT INTO shared_modules (module_id, shared_with_user_id, shared_by_user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [id, targetUser.user_id, req.user.user_id]
    );

    res.json({
      ...shared,
      shared_with: targetUser,
    });
  } catch (err) {
    console.error("Error sharing module with user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get modules shared with logged-in user directly or through a class.
app.get("/shared/modules", authenticateToken, async (req, res) => {
  try {
    const data = await db.any(
      `
      SELECT
        m.*,
        MIN(sm.shared_module_id) AS shared_module_id,
        MIN(sm.shared_by_user_id) AS shared_by_user_id,
        MIN(u.username) AS shared_by_username,
        STRING_AGG(DISTINCT c.name, ', ') AS class_name,
        BOOL_OR(sm.shared_with_user_id = $1) AS shared_directly,
        BOOL_OR(cm.user_id = $1) AS shared_through_class
      FROM shared_modules sm
      JOIN modules m ON m.module_id = sm.module_id
      JOIN users u ON u.user_id = sm.shared_by_user_id
      LEFT JOIN classes c ON c.class_id = sm.class_id
      LEFT JOIN class_members cm ON cm.class_id = sm.class_id
      WHERE sm.shared_with_user_id = $1
         OR cm.user_id = $1
      GROUP BY m.module_id
      ORDER BY m.module_id ASC;
      `,
      [req.user.user_id]
    );

    res.json(data);
  } catch (err) {
    console.error("Error fetching shared modules:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get modules shared to a specific class.
// Only class members can see these.
app.get("/classes/:classId/modules", authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;

    const membership = await db.oneOrNone(
      `
      SELECT *
      FROM class_members
      WHERE class_id = $1 AND user_id = $2;
      `,
      [classId, req.user.user_id]
    );

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this class",
      });
    }

    const modules = await db.any(
      `
      SELECT
        m.*,
        sm.shared_module_id,
        sm.shared_by_user_id,
        u.username AS shared_by_username
      FROM shared_modules sm
      JOIN modules m ON m.module_id = sm.module_id
      JOIN users u ON u.user_id = sm.shared_by_user_id
      WHERE sm.class_id = $1
      ORDER BY m.module_id ASC;
      `,
      [classId]
    );

    res.json(modules);
  } catch (err) {
    console.error("Error fetching class modules:", err);
    res.status(500).json({ error: err.message });
  }
});

// Stop sharing a module.
// Only the person who shared it or the module owner can remove the shared record.
app.delete("/shared/modules/:sharedModuleId", authenticateToken, async (req, res) => {
  try {
    const { sharedModuleId } = req.params;

    const sharedRecord = await db.oneOrNone(
      `
      SELECT sm.*, m.user_id AS module_owner_id
      FROM shared_modules sm
      JOIN modules m ON m.module_id = sm.module_id
      WHERE sm.shared_module_id = $1;
      `,
      [sharedModuleId]
    );

    if (!sharedRecord) {
      return res.status(404).json({ error: "Shared module record not found" });
    }

    const canDelete =
      sharedRecord.shared_by_user_id === req.user.user_id ||
      sharedRecord.module_owner_id === req.user.user_id;

    if (!canDelete) {
      return res.status(403).json({
        error: "You do not have permission to remove this shared module",
      });
    }

    await db.none("DELETE FROM shared_modules WHERE shared_module_id = $1", [
      sharedModuleId,
    ]);

    res.json({ success: true, message: "Shared module removed" });
  } catch (err) {
    console.error("Error removing shared module:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- exercises routes ----------

// This route now checks access to the module connected to the exercise.
app.get("/exercises/:id", optionalAuthenticateToken, async (req, res) => {
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

    const userId = req.user ? req.user.user_id : null;
    const access = await canUserAccessModule(data.module_id, userId);

    if (!access.allowed) {
      return res.status(403).json({
        error: "You do not have access to this exercise",
      });
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

// This route now checks access to the module before returning exercises.
app.get("/modules/:id/exercises", optionalAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.user_id : null;

    const access = await canUserAccessModule(id, userId);

    if (!access.moduleRecord) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (!access.allowed) {
      return res.status(403).json({
        error: "You do not have access to this module's exercises",
      });
    }

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