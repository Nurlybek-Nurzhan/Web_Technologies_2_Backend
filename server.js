const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const DATA_FILE = "./data.json";

// --- Helper Functions ---
const readData = () => {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- Required Demo Routes ---
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/time", (req, res) => {
  res.json({ currentTime: new Date().toISOString() });
});

app.get("/status", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// --- CRUD API for Tasks ---

// 1. GET all tasks
app.get("/tasks", (req, res) => {
  const data = readData();
  res.json(data.tasks);
});

// 2. POST a new task
app.post("/tasks", (req, res) => {
  const data = readData();
  const newTask = {
    id: Date.now(), // Simple unique ID using timestamp
    name: req.body.name,
    completed: req.body.completed || false,
  };

  data.tasks.push(newTask);
  writeData(data);
  res.status(201).json(newTask);
});

// 3. PUT (Update) a task by ID
app.put("/tasks/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  data.tasks[index] = { ...data.tasks[index], ...req.body };
  writeData(data);
  res.json(data.tasks[index]);
});

// 4. DELETE a task by ID
app.delete("/tasks/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const initialLength = data.tasks.length;

  data.tasks = data.tasks.filter((t) => t.id !== id);

  if (data.tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
