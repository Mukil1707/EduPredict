import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("students.db");

// Initialize database
db.exec(`
  DROP TABLE IF EXISTS students;
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    attendance INTEGER,
    study_hours REAL,
    assignment_marks REAL,
    previous_exam_marks REAL,
    predicted_score REAL,
    risk_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Seed initial data if empty
const seedData = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (userCount === 0) {
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run("admin@edupredict.ai", "admin123");
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    
    if (user) {
      res.json({ success: true, user: { email: user.email, name: user.email.split('@')[0] } });
    } else {
      res.status(401).json({ error: "Invalid credentials. Use admin@edupredict.ai / admin123" });
    }
  });

  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students ORDER BY id DESC").all();
    res.json(students);
  });

  app.delete("/api/students/all", (req, res) => {
    db.prepare("DELETE FROM students").run();
    res.json({ success: true });
  });

  app.delete("/api/students/:id", (req, res) => {
    db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/predict", (req, res) => {
    const { student_id, name, email, department, attendance, study_hours, assignment_marks, previous_exam_marks } = req.body;
    
    let predicted_score = (attendance * 0.15) + (study_hours * 2.0) + (assignment_marks * 0.25) + (previous_exam_marks * 0.4);
    predicted_score = Math.min(100, Math.max(0, predicted_score));
    
    let risk_level = "Low";
    if (predicted_score < 40) risk_level = "High";
    else if (predicted_score < 70) risk_level = "Medium";

    try {
      const stmt = db.prepare(`
        INSERT INTO students (student_id, name, email, department, attendance, study_hours, assignment_marks, previous_exam_marks, predicted_score, risk_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(student_id) DO UPDATE SET
          name=excluded.name,
          email=excluded.email,
          department=excluded.department,
          attendance=excluded.attendance,
          study_hours=excluded.study_hours,
          assignment_marks=excluded.assignment_marks,
          previous_exam_marks=excluded.previous_exam_marks,
          predicted_score=excluded.predicted_score,
          risk_level=excluded.risk_level
      `);
      const info = stmt.run(student_id, name, email, department, attendance, study_hours, assignment_marks, previous_exam_marks, predicted_score, risk_level);

      res.json({ 
        id: info.lastInsertRowid || 0,
        predicted_score,
        risk_level,
        success: true
      });
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({ error: "Failed to process student data. Ensure Student ID is unique." });
    }
  });

  app.get("/api/stats", (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as count FROM students").get().count;
    const highRisk = db.prepare("SELECT COUNT(*) as count FROM students WHERE risk_level = 'High'").get().count;
    const avgScore = db.prepare("SELECT AVG(predicted_score) as avg FROM students").get().avg || 0;
    
    // Mock trends based on data presence
    const trends = {
      total: total > 5 ? "+12%" : "0%",
      risk: highRisk > 2 ? "+5%" : "0%",
      avg: avgScore > 50 ? "+3.2%" : "0%",
      active: Math.floor(Math.random() * (30 - 15 + 1) + 15).toString()
    };
    
    res.json({
      totalStudents: total,
      highRiskCount: highRisk,
      averagePredictedScore: Math.round(avgScore * 10) / 10,
      trends
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
