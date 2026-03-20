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

app.use(express.json());

//Ports for communication while developtment
const PORT = 3000; 
const sisterPort = 5173;
app.use(cors({origin: `http://localhost:${sisterPort}`}));


const game = new Chess();
let boardState = game.fen();

console.log(game.moves());

app.use('/node_modules',express.static(path.join(__dirname,'node_modules')));//all libraries are included here

app.get('/move',(req,res) => {
  console.log(req.body);
  res.end();
})

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

app.post('/create',(req,res) => {
  console.log(req.body);
  game.move(req.body);
  position = {fen: game.fen()};
  res.json(position);
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
