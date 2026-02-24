const express = require("express");
const path = require("path");

const app = express();
const PORT = 16754;

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload_sld.html"));
});

app.get("/pricelist", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pricelist.html"));
});

app.get("/box_finder", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "box_finder.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload_sld.html"));
});

app.get("/attendance_user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "attendance_user.html"));
});

app.get("/upload_sld", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload_sld.html"));
});

app.get("/list_draft", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "list_draft.html"));
});

app.get("/list_project", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "list_project.html"));
});

app.get("/price_finder", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "price_finder.html"));
});

app.get("/user_management", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user_management.html"));
});

app.get("/table_penawaran", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "draft_penawaran.html"));
});

app.get("/box_list", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "box_list.html"));
});

app.get("/invoice_upload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "invoice_upload.html"));
});

app.get("/list_invoice", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "list_invoice.html"));
});

app.get("/invoice_detail", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "invoice_detail.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
