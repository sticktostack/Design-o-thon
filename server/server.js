require("dotenv").config();

console.log("STEP 1");

const connectDB = require("./config/db");
console.log("STEP 2");

const app = require("./app");
console.log("STEP 3");

const http = require("http");
console.log("STEP 4");

const { Server } = require("socket.io");
console.log("STEP 5");

connectDB();
console.log("STEP 6");

const server = http.createServer(app);
console.log("STEP 7");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

console.log("STEP 8");

global.io = io;

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});