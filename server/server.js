require("dotenv").config();

console.log("A");

const connectDB = require("./config/db");

console.log("B");

const app = require("./app");

console.log("C");

connectDB();

console.log("D");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});