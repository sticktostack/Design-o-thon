require("dotenv").config();

console.log("A");

const express = require("express");

console.log("B");

const connectDB = require("./config/db");

console.log("C");

connectDB();

console.log("D");

const app = express();

app.get("/", (req, res) => {
  res.send("Working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});