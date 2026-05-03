const Mentor = require("../models/Mentor");
const bcrypt = require("bcryptjs");
const createNotification = require("../utils/createNotification");
const sendEmail = require("../utils/sendEmail");

// Add Mentor
exports.addMentor = async (req, res) => {
  try {
    const { name, email, expertise, password } = req.body;

    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      return res.status(400).json({
        message: "Mentor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = await Mentor.create({
      name,
      email,
      expertise,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Mentor added successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate(
      "assignedTeams",
      "teamName collegeName",
    );

    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Mentor
exports.deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Assign Mentor to Team
exports.assignMentorToTeam = async (req, res) => {
  try {
    const { mentorId, teamId } = req.body;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    if (mentor.assignedTeams.includes(teamId)) {
      return res.status(400).json({
        message: "Team already assigned",
      });
    }

    mentor.assignedTeams.push(teamId);
    await mentor.save();

    res.status(200).json({
      message: "Mentor assigned successfully",
    });

    const assignedTeam = await Team.findById(teamId);

    const assignedMentor = await Mentor.findById(mentorId);

    if (assignedTeam && assignedTeam.email) {
      await sendEmail(
        assignedTeam.email,
        `Mentor Assigned for Round ${roundNumber}`,
        `
      <h2>Design O Thon - Mentor Assignment</h2>

      <p>
        A mentor has been assigned to guide your team.
      </p>

      <p><strong>Mentor Name:</strong> ${assignedMentor.name}</p>
      <p><strong>Round:</strong> ${roundNumber}</p>

      <p>
        Stay connected and improve your design.
      </p>

      <p>Best wishes from Inspiria Knowledge Campus</p>
    `,
      );
    }

    await createNotification(
      "Mentor Assigned",
      `${assignedMentor.name} assigned to ${assignedTeam.teamName}`,
      "mentor",
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
