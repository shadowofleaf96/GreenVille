const { Contacts } = require("../models/Contact");
const transporter = require("../middleware/mailMiddleware");
require("dotenv").config();

const createContact = async (req, res) => {
  try {
    const newContact = new Contacts(req.body);
    await newContact.save();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: newContact.email,
      subject: "Thank You for Contacting Us",
      html: confirmationEmailTemplate(newContact.name),
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Contact saved and email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save contact or send email" });
  }
};

function confirmationEmailTemplate(name) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>Thank you for reaching out to us! We have received your message and one of our representatives will get back to you shortly.</p>
          <p style="color: #555;">We appreciate your interest and will do our best to provide a prompt and helpful response.</p>
          <p>Best regards,<br/>GreenVille</p>
        </div>
      </body>
    </html>
  `;
}

module.exports = {
  createContact,
};
