const Judge = require("../models/judge");
const Team = require("../models/team");
const Submission = require("../models/submission");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createNotification = require("../utils/createNotification");
const sendEmail = require("../utils/sendEmail")
const JudgeAssignment = require("../models/JudgeAssignment");
const Score = require("../models/Score");
const Round = require("../models/round");

/*
==================================================
JUDGE LOGIN
==================================================
*/
exports.judgeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const judge = await Judge.findOne({ email });

    if (!judge) {
      return res.status(404).json({
        message: "Judge not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      judge.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: judge._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      judge
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
ADD JUDGE
==================================================
*/
exports.addJudge = async (req, res) => {
  try {
    const {
      name,
      email,
      expertise,
      password
    } = req.body;

    /*
    =========================================
    CHECK IF JUDGE EXISTS
    =========================================
    */
    const existingJudge = await Judge.findOne({ email });

    if (existingJudge) {
      return res.status(400).json({
        message: "Judge already exists",
      });
    }

    /*
    =========================================
    HASH PASSWORD
    =========================================
    */
    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    =========================================
    CREATE JUDGE
    =========================================
    */
    const judge = await Judge.create({
      name,
      email,
      expertise,
      password: hashedPassword,
    });

    /*
    =========================================
    SEND EMAIL TO JUDGE
    =========================================
    */
    try {
      await sendEmail(
  email,
  "Welcome to Design-o-thon - Evaluation Panel Credentials",
  `
<div style="
  margin: 0;
  padding: 0;
  width: 100%;
  background: #05070d;
  font-family: 'Segoe UI', Arial, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
    width: 100%;
    background: #05070d;
    margin: 0;
    padding: 0;
  ">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
          max-width: 950px;
          width: 100%;
          background: #0b0f18;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        ">

          <!-- HERO IMAGE -->
          <tr>
            <td>
              <img
                src="https://inspiria.edu.in/wp-content/uploads/Design-o-thon.webp"
                style="width: 100%; display: block;"
              />
            </td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #05070d, #0b0f18);
              padding: 40px;
              text-align: center;
              color: #ffffff;
            ">

              <h1 style="
                margin: 0;
                font-size: 30px;
                color: #7CFF3B;
              ">
                Welcome to Design-o-thon 2026
              </h1>

              <p style="
                margin-top: 14px;
                color: #d1d5db;
              ">
                Official Selection Confirmation
              </p>

              <p style="
                margin-top: 8px;
                color: #9ca3af;
              ">
                Inspiria Knowledge Campus
              </p>

            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="
              padding: 42px;
              background: #ffffff;
              color: #111827;
            ">

              <h2 style="font-size: 26px;">
                Welcome!
              </h2>

              <p style="
                font-size: 15px;
                color: #475569;
                line-height: 1.8;
              ">
                You have been officially selected
                <strong>to evaluate teams for Design-o-thon 2026</strong>.
              </p>

              <p style="
                font-size: 15px;
                color: #475569;
                line-height: 1.8;
              ">
                Your role is crucial in evaluating innovative designs and ensuring fair scoring across all participating teams.
              </p>

              <!-- JUDGE DETAILS -->
              <table width="100%" style="
                margin-top: 30px;
                background: #f8fafc;
                border-left: 6px solid #7CFF3B;
              ">
                <tr>
                  <td style="padding: 25px;">

                    <h3>Your Details</h3>

                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Expertise:</strong> ${expertise}</p>

                  </td>
                </tr>
              </table>

              <!-- LOGIN DETAILS -->
              <table width="100%" style="
                margin-top: 25px;
                background: #f0fff4;
                border-left: 6px solid #22c55e;
              ">
                <tr>
                  <td style="padding: 25px;">

                    <h3 style="color:#166534;">
                      Login Credentials
                    </h3>

                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>

                  </td>
                </tr>
              </table>

              <!-- INSTRUCTIONS -->
              <div style="margin-top: 30px;">

                <h3>Instructions</h3>

                <p style="color:#475569;">
                  • Login to the Scoring Panel and evaluate assigned teams.
                </p>

                <p style="color:#475569;">
                  • Provide fair and criteria-based scoring.
                </p>

                <p style="color:#475569;">
                  • Ensure submissions are reviewed before deadlines.
                </p>

              </div>

              <!-- BUTTON -->
              <div style="margin-top: 30px; text-align:center;">
                <a href="http://127.0.0.1:5500/client/judge/login.html"
                  style="
                    background:#22c55e;
                    color:#fff;
                    padding:14px 28px;
                    text-decoration:none;
                    font-weight:bold;
                    border-radius:6px;
                  ">
                  Login
                </a>
              </div>

              <!-- CLOSING -->
              <div style="margin-top: 35px;">
                <p style="
                  font-weight: 600;
                  color: #166534;
                ">
                  We look forward to your valuable contribution!
                </p>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              background: #0b0f18;
              padding: 25px;
              text-align: center;
              color: #cbd5e1;
              font-size: 14px;
            ">
              Design O Thon Admin Panel<br>
              Inspiria Knowledge Campus
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`
);
    } catch (emailError) {
      console.log("Email Error:", emailError);
    }

    /*
    =========================================
    SOCKET + NOTIFICATION
    =========================================
    */
    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    await createNotification(
      "New Judge Added",
      `${name} has been added as a judge.`,
      "score"
    );

    res.status(201).json({
      message: "added & email sent successfully",
      judge,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
==================================================
GET ALL JUDGES
==================================================
*/
exports.getJudges = async (req, res) => {
  try {
    const judges = await Judge.find();

    res.status(200).json(judges);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
DELETE JUDGE
==================================================
*/
exports.deleteJudge = async (req, res) => {
  try {
    await Judge.findByIdAndDelete(req.params.id);

    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    res.status(200).json({
      message: "Judge deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
BASIC ASSIGN TEAM (OLD SUPPORT)
==================================================
*/
exports.assignJudgeToTeam = async (req, res) => {
  try {
    const { judgeId, teamId } = req.body;

    const judge = await Judge.findById(judgeId);
    const team = await Team.findById(teamId);

    if (!judge || !team) {
      return res.status(404).json({
        message: "Judge or Team not found"
      });
    }

    const alreadyAssigned = judge.assignedTeams.some(item => {
      if (typeof item === "object" && item.team) {
        return item.team.toString() === teamId;
      }
      return item.toString() === teamId;
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: "Team already assigned"
      });
    }

    judge.assignedTeams.push({
      team: teamId,
      roundNumber: 1
    });

    await judge.save();

    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    res.status(200).json({
      message: "Judge assigned successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
GET JUDGE ASSIGNED TEAMS
(FIXED FOR OLD + NEW DATA)
==================================================
*/
exports.getJudgeAssignedTeams = async (req, res) => {
  try {
    const { judgeName } = req.params;

    /*
    =========================================
    FIND JUDGE
    =========================================
    */
    const judge = await Judge.findOne({
      name: String(judgeName).trim()
    });

    if (!judge) {
      return res.status(404).json({
        message: "Judge not found"
      });
    }

    /*
    =========================================
    GET ASSIGNMENTS
    =========================================
    */
    const assignments = await JudgeAssignment.find({
      judge: judge._id
    })
      .populate("team", "teamName collegeName email")
      .sort({ createdAt: -1 });

    const result = [];

    for (const item of assignments) {
      if (!item.team) continue;

      /*
      =========================================
      ✅ FIX: DEFINE ROUND PROPERLY
      =========================================
      */
      const round = await Round.findOne({
        roundNumber: item.roundNumber
      });

      /*
      =========================================
      GET SUBMISSION (OPTIONAL)
      =========================================
      */
      const submission = await Submission.findOne({
        team: item.team._id,
        roundNumber: item.roundNumber
      }).sort({ createdAt: -1 });

      /*
      =========================================
      CHECK IF ALREADY SCORED
      =========================================
      */
      let alreadyScored = false;

      if (round) {
        const existingScore = await Score.findOne({
          judge: judge._id,
          team: item.team._id,
          round: round._id
        });

        alreadyScored = !!existingScore;
      }

      result.push({
        team: {
          _id: item.team._id,
          teamName: item.team.teamName,
          collegeName: item.team.collegeName,
          email: item.team.email
        },

        assignedRound: item.roundNumber,

        submission: submission
          ? {
              roundNumber: submission.roundNumber,
              figmaLink: submission.figmaLink || "",
              canvaLink: submission.canvaLink || "",
              pdfFile: submission.pdfFile || "",
              createdAt: submission.createdAt
            }
          : null,

        alreadyScored
      });
    }

    res.status(200).json(result);

  } catch (error) {
    console.log("ASSIGNED TEAMS ERROR:", error); // ⭐ IMPORTANT DEBUG LINE

    res.status(500).json({
      message: error.message
    });
  }
};