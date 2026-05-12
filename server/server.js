console.log("A");

require("dotenv").config();

console.log("B");

const express = require("express");

console.log("C");

const app = express();

console.log("D");

app.get("/", (req, res) => {
  res.send("Working");
});

console.log("E");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});