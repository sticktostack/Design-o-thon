const nodemailer = require("nodemailer");
require("dotenv").config();
console.log(`coming from sendemail.js EMAIL_USER is ${process.env.EMAIL_USER}`);
console.log(`coming from sendemail.js EMAIL_PASS is ${process.env.EMAIL_PASS}`);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Design-O-Thon" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log("Email sent successfully:", info.response);

  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;