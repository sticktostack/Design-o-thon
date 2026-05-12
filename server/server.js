console.log("A");

require("dotenv").config();

console.log("B");

const connectDB = require("./config/db");

console.log("C");

const app = require("./app");

console.log("D");