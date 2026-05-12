const Team = require("../models/team");
const bcrypt = require("bcryptjs");
const createNotification = require("../utils/createNotification");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Team Login
exports.teamLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const team = await Team.findOne({ email });

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const isMatch = await bcrypt.compare(password, team.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: team._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Add Team + Auto Email Send

exports.addTeam = async (req, res) => {
  try {
    const { teamName, collegeName, teamLeader, email, password } = req.body;

    // Check existing team
    const existingTeam = await Team.findOne({
      email,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team already exists with this email",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save team in DB
    const team = await Team.create({
      teamName,
      collegeName,
      teamLeader,
      email,
      password: hashedPassword,
    });

    // Create notification
    await createNotification(
      "New Team Registered",
      `${teamName} has been successfully registered.`,
      "submission",
    );

    // Send credentials email
    await sendEmail(
      email,
      "Welcome to Design-o-thon - Your Team Login Credentials",
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

          <!-- HERO IMAGE SECTION -->
          <tr>
            <td style="padding: 0;">

              <img
                src="https://inspiria.edu.in/wp-content/uploads/Design-o-thon.webp"
                alt="Design o Thon Banner"
                style="
                  width: 100%;
                  display: block;
                  border: 0;
                "
              />

            </td>
          </tr>

          <!-- HEADER TEXT -->
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
                font-weight: 700;
                color: #7CFF3B;
                letter-spacing: 0.5px;
              ">
                Welcome to Design-o-thon 2026
              </h1>

              <p style="
                margin-top: 14px;
                font-size: 16px;
                line-height: 1.8;
                color: #d1d5db;
              ">
                Official Team Registration Confirmation
              </p>

              <p style="
                margin-top: 8px;
                font-size: 15px;
                color: #9ca3af;
              ">
                Hosted under Inspiria Knowledge Campus
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

              <h2 style="
                margin-top: 0;
                font-size: 28px;
                color: #111827;
              ">
                Welcome to<br> 
                Design-o-Thon!
              </h2>

              <p style="
                font-size: 15px;
                line-height: 1.9;
                color: #475569;
              ">
                Your team has been successfully registered for
                <strong>Design-o-thon 2026</strong>,
                the official 24-Hour UI/UX Sprint hosted under
                <strong>Inspiria Knowledge Campus</strong>.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.9;
                color: #475569;
              ">
                We are excited to have your team participate and showcase your
                creativity, innovation, and design excellence throughout the competition.
              </p>

              <!-- TEAM DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                margin-top: 35px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-left: 6px solid #7CFF3B;
              ">
                <tr>
                  <td style="padding: 28px;">

                    <h3 style="
                      margin-top: 0;
                      margin-bottom: 18px;
                      font-size: 20px;
                      color: #111827;
                    ">
                      Team Registration Details
                    </h3>

                    <p><strong>Team Name:</strong> ${teamName}</p>
                    <p><strong>College Name:</strong> ${collegeName}</p>
                    <p><strong>Team Leader:</strong> ${teamLeader}</p>

                  </td>
                </tr>
              </table>

              <!-- LOGIN CREDENTIALS -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                margin-top: 28px;
                background: #f0fff4;
                border: 1px solid #d1fae5;
                border-left: 6px solid #22c55e;
              ">
                <tr>
                  <td style="padding: 28px;">

                    <h3 style="
                      margin-top: 0;
                      margin-bottom: 18px;
                      font-size: 20px;
                      color: #166534;
                    ">
                      Team Login Credentials
                    </h3>

                    <p><strong>Login Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>

                  </td>
                </tr>
              </table>

              <!-- BUTTON -->
              <div style="margin-top: 30px; text-align:center;">
                <a href="http://127.0.0.1:5500/client/team/login.html"
                  style="
                    background:#22c55e;
                    color:#fff;
                    padding:14px 28px;
                    text-decoration:none;
                    font-weight:bold;
                    border-radius:6px;
                  ">
                  Open Team Panel
                </a>
              </div>

              <!-- IMPORTANT INSTRUCTIONS -->
              <div style="margin-top: 35px;">

                <h3 style="
                  font-size: 20px;
                  color: #111827;
                  margin-bottom: 14px;
                ">
                  Important Instructions
                </h3>

                <p style="
                  font-size: 15px;
                  line-height: 1.9;
                  color: #475569;
                ">
                  Please login to your Team Panel and submit your designs before
                  the round deadlines.
                </p>

                <p style="
                  font-size: 15px;
                  line-height: 1.9;
                  color: #475569;
                ">
                  Kindly keep your credentials secure and avoid sharing them
                  outside your team.
                </p>

              </div>

              <!-- CLOSING MESSAGE -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                margin-top: 35px;
                background: #ecfdf5;
                border: 1px solid #bbf7d0;
              ">
                <tr>
                  <td style="padding: 28px;">

                    <p style="
                      margin: 0;
                      font-size: 17px;
                      font-weight: 600;
                      color: #166534;
                    ">
                      We wish your team the very best for the Hackathon!
                    </p>

                    <p style="
                      margin-top: 14px;
                      font-size: 15px;
                      line-height: 1.9;
                      color: #166534;
                    ">
                      We look forward to witnessing your innovation and creativity
                      at Design-o-thon 2026.
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          

          <!-- FOOTER -->
          <tr>
            <td style="
              background: #0b0f18;
              padding: 28px;
              text-align: center;
              color: #cbd5e1;
              font-size: 14px;
              line-height: 1.8;
            ">
              This is an official mail from the Design O Thon Admin Panel<br>
              Inspiria Knowledge Campus
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`,
    );

    return res.status(201).json({
      message: "Team created successfully and email sent",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find();

    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Team
exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Team deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
