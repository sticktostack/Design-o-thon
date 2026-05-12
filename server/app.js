const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/adminRoutes");
const teamRoutes = require("./routes/teamRoutes");
const judgeRoutes = require("./routes/judgeRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const roundRoutes = require("./routes/roundRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// const startDeadlineReminder = require("./utils/deadlineReminder");
const judgeAssignmentRoutes = require("./routes/judgeAssignmentRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/round", roundRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/score", scoreRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/judge-assignment",judgeAssignmentRoutes);

app.get("/", (req, res) => {
  res.send("Design O Thon Backend Running Successfully");
});

module.exports = app;