const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
const port = process.env.PORT || 3000;

let timer = 2

app.use(cors());
app.use(express.json());

app.post("/board", (req, res) => {

  if (timer >= 0) {
    res.status(400).json({ status: "error", message: "Timer has not expired" });
    return;
  }

  timer = 120
  const { message, author, x, y, angle } = req.body;

  try {
    pool.query("INSERT INTO board (message, author, x, y, angle) VALUES ($1, $2, $3, $4, $5)", [message, author, x, y, angle], (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ status: "error", message: "Database query failed" });
      } else {
        console.log(`Received message: ${message} from author: ${author}`);
        res.json({ status: "success", message: "Note received" });
      }
    });
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ status: "error", message: "Database query failed" });
  }
});

app.get("/board", (req, res) => {
  try {
    pool.query("SELECT * FROM board", (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ status: "error", message: "Database query failed" });
      } else {
        res.json(result.rows);
      }
    });
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ status: "error", message: "Database query failed" });
  }
});

app.get("/timer", (req, res) => {
  res.json({ timer: timer });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

setInterval(() => {
  timer = timer - 1
}, 1000);