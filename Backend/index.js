//includes for app to work
const express = require('express'); 
const cors = require('cors');
const path = require('path');
const { Chess } = require('chess.js');
const pgp = require('pg-promise')()
const db = pgp({
  host: 'localhost',
  port: 5431,
  database: 'postgres',
  user: 'dev_test',
  password: 'RoadToTest'
})

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const game = new Chess();
let boardState = game.fen();

const insertExercise = async ( exerciseData ) => {
  return db.one(`
    INSERT INTO exercise(iPos, solution, color)
    VALUES($(iPos), $(solution), $(color))
    RETURNING exercise_id
    `,(exerciseData.exData))

}
const buildExercise = async (id) => {
  return db.one(`
    SELECT * FROM exercise
    WHERE exercise_id = ($1)
    `,id)
}
app.use('/node_modules',express.static(path.join(__dirname,'node_modules')));//all libraries are included here


app.get('/reset', (req,res) => {
  game.reset();
  res.end();
})

app.get('/test',async (req,res)=>{
  try{
    console.log("request made");
    const data = await db.any('SELECT * FROM exercise');
    res.json(data);
  }catch(err){ res.status(500).json({ error: err.message }) }
  console.log(game.ascii());
  console.log(boardState);
  res.end();
})
.post('/test',(req,res) =>{
  console.log(req.body)
  game.move(req.body);
  console.log(game.history())
  position = {fen: game.fen()};
  res.json(position);
});

app.get('/build', async (req,res) => {
  const exData = await buildExercise(4); 
  res.json(exData);
})

app.post('/create',async (req,res) => {
  const exData = req.body;
  console.log(exData,"this is it");
  await insertExercise(exData)
  .then( (id) => console.log(id) );
  
})

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
    const data = await db.one("SELECT * FROM modules WHERE module_id = $1", [id]);
    res.json(data);
  } catch (err) {
    console.error("Error fetching module:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/exercises/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.oneOrNone(
      "SELECT exercise_id, iPos, solution, color FROM exercise WHERE exercise_id = $1",
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
      title: `Exercise ${data.exercise_id}`,
      description: "Solve the exercise on the board below.",
      initial_fen: data.iPos,
      solution_moves: parsedSolution,
      side_to_move: data.color,
    });
  } catch (err) {
    console.error("Error fetching exercise:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
