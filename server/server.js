require("dotenv").config();

const startDeadlineReminder = require("./utils/deadlineReminder");

const connectDB = require("./config/db");
const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");

connectDB();

// startDeadlineReminder();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

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