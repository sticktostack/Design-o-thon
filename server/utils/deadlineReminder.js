const cron = require("node-cron");
const Round = require("../models/round");
const Team = require("../models/team");

const createNotification = require("./createNotification");
const sendEmail = require("./sendEmail");

const startDeadlineReminder = () => {
  // Runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    console.log("Checking round deadlines...");

    try {
      const rounds = await Round.find({
        status: "Active"
      });

      const teams = await Team.find();

      const now = new Date();

      for (let round of rounds) {
        const deadline = new Date(round.deadline);

        const diffMs = deadline - now;
        const diffHours = Math.floor(
          diffMs / (1000 * 60 * 60)
        );

        // 2 Hour Reminder
        if (diffHours <= 2 && diffHours > 0) {
          const uniqueKey =
            `round-${round.roundNumber}-2hours`;

          await createNotification(
            "Round Deadline Reminder",
            `Round ${round.roundNumber} closes in ${diffHours} hour(s).`,
            "round",
            uniqueKey
          );

          for (let team of teams) {
            await sendEmail(
              team.email,
              `Round ${round.roundNumber} Deadline Reminder`,
              `
                <h2>Design O Thon Reminder</h2>

                <p>
                  Round ${round.roundNumber}
                  closes in
                  ${diffHours} hour(s).
                </p>

                <p>
                  Please complete your submission
                  before the deadline.
                </p>

                <p>Best of luck 🚀</p>
              `
            );
          }
        }

        // Final 30 Min Alert
        if (
          diffMs <= 30 * 60 * 1000 &&
          diffMs > 0
        ) {
          const uniqueKey =
            `round-${round.roundNumber}-30mins`;

          await createNotification(
            "Final Deadline Alert",
            `Round ${round.roundNumber} closes in less than 30 minutes.`,
            "round",
            uniqueKey
          );

          for (let team of teams) {
            await sendEmail(
              team.email,
              `URGENT: Final 30 Minutes Left`,
              `
                <h2>Final Submission Alert</h2>

                <p>
                  Round ${round.roundNumber}
                  closes in less than
                  30 minutes.
                </p>

                <p>
                  Submit immediately to avoid lock.
                </p>

                <p>Good luck 🚀</p>
              `
            );
          }
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  });
};

module.exports = startDeadlineReminder;