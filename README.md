# RoadToGM
RoadToGM is a chess learning platform that aims at polishing players skill and facilitate the teaching of others.

# Overview
Recently a chess learning resource Chessimo is being lost. Its teaching method is pretty unique and organized even among the recently growning chess platform that have become popular chess.com, lichess, etc. These chess platforms allow for the players to train with puzzles and sometimes recorded lessons from pro-players but their main focus is playing games. Chessimo is strictly for training and becoming a better player it introduces complex puzzles as bite size versions of themselves and presents them for you to solve progressively until solving the original. Our goal is to keep that teaching style alive by creating a similar chess platform with improvements to what came before. The users that most will benefit from this project are those that wish to hone their skills or teach the game to others.  

# Tech stack
1. Languages: JavaScript,TypeScript,CSS,HTML
2. Framework: React,chess.js, react-chessboard.js, express
3. Database: PostgreSQL
4. Tools: Git, Docker 

# Installation

Prerequisites
node.js 18+, PostgreSQL 14+, React, express

Steps
git clone https://github.com/RaquelQuinones/RoadToGM.git

cd RoadToGM/Frontend; npm install
cd RoadToGM/Backend; npm install

Database setup 

database credentials for the postgres image
  host: "localhost",
  port: 5431,
  database: "postgres",
  user: "dev_test",
  password: "RoadToTest",

They can be changed just need to update them in index.js db variable.

CREATE DATABASE postgres

CREATE TABLE users(user_id SERIAL PRIMARY KEY , username TEXT, email TEXT, password_hash TEXT, role TEXT);
CREATE TABLE modules(module_id SERIAL PRIMARY KEY , title TEXT, description TEXT, category TEXT, is_default BOOLEAN, difficulty TEXT, user_id INTEGER REFERENCES users(user_id), is_published BOOLEAN);
CREATE TABLE exercise(exercise_id SERIAL PRIMARY KEY ,ipos TEXT ,solution TEXT[] ,color BOOLEAN,module_id INTEGER REFERENCES modules(module_id),title TEXT, description TEXT, difficulty TEXT DEFAULT 'Beginner');

# Running app
cd RoadToGM/Frontend; npm run dev
cd RoadToGM/Backend; npm run dev
Run the database image

open browser and paste the localHost link app should be running functionaly
