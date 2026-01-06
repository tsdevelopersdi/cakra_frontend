const express = require("express");
const path = require("path");

const app = express();
const PORT = 4949;

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "attendance_user.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "attendance_user.html"));
});

app.get("/attendance_user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "attendance_user.html"));
});

app.get("/user_management", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user_management.html"));
});

app.get("/user_detail_attendance", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user_detail_attendance.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
