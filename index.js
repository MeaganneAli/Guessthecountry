import express from "express";
import bodyParser from "body-parser";
import pg from "pg";//import to get access to db

const db = new pg.Client({//Whic db to access
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "Webdeveloper1977!",
  port: 5432,
});

const app = express();
const port = 3001;

db.connect();//connect

let quiz = [];
db.query("SELECT * FROM capitals", (err, res) => {//Get all the data from the db
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;//get all the rows
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));//get access from the form
app.use(express.static("public"));//get access to css al static files on public

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
