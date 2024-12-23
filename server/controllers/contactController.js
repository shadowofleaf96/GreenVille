const { Contacts } = require("../models/Contact");
const transporter = require("../middleware/mailMiddleware");
require("dotenv").config();

exports.createContact = async (req, res) => {
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

exports.getAllContactMessages = async (req, res) => {
  try {
    const contact = await Contacts.find();
    res.status(200).json({ data: contact });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve coupons" });
  }
};

exports.editContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number, message } = req.body;

  try {
    const updatedContact = await Contacts.findByIdAndUpdate(
      id,
      { name, email, phone_number, message },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({
      message: "Contact Message updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contacts.findByIdAndDelete(id);

    if (!deletedContact)
      return res.status(404).json({ error: "Contact Message not found" });

    res.status(200).json({
      success: true,
      message: "Contact Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.replyToContact = async (req, res) => {
  const { email, subject, name, message } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: ReplyEmailTemplate(name, message),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
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

function ReplyEmailTemplate(name, message) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>We have reviewed your inquiry and would like to provide you with the following response:</p>
          <p style="color: #555; font-style: italic;">"${message}"</p>
          <p>If you have any further questions, please feel free to reach out to us. We're here to help!</p>
          <p>Best regards,<br/>GreenVille Team</p>
        </div>
      </body>
    </html>
  `;
}
