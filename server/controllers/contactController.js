import { Contacts } from "../models/Contact.js";
import transporter from "../middleware/mailMiddleware.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { createDashboardNotification } from "../utils/dashboardNotificationUtility.js";

function confirmationEmailTemplate(name, siteLogo, siteTitle, primaryColor) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Hello ${name},</h2>
          <p>Thank you for reaching out to us! We have received your message and one of our representatives will get back to you shortly.</p>
          <p style="color: #555;">We appreciate your interest and will do our best to provide a prompt and helpful response.</p>
          <p>Best regards,<br/>${siteTitle}</p>
        </div>
      </body>
    </html>
  `;
}

function ReplyEmailTemplate(name, message, siteLogo, siteTitle, primaryColor) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Hello ${name},</h2>
          <p>We have reviewed your inquiry and would like to provide you with the following response:</p>
          <p style="color: #555; font-style: italic;">"${message}"</p>
          <p>If you have any further questions, please feel free to reach out to us. We're here to help!</p>
          <p>Best regards,<br/>${siteTitle} Team</p>
        </div>
      </body>
    </html>
  `;
}

export const createContact = async (req, res) => {
  const newContact = new Contacts(req.body);
  await newContact.save();

  // Dashboard Notification for Admin
  try {
    await createDashboardNotification({
      type: "CONTACT_MESSAGE",
      title: "New Contact Message",
      message: `New message from ${newContact.name}: "${
        newContact.subject || "No Subject"
      }"`,
      metadata: { contact_id: newContact._id },
      recipient_role: "admin",
    });
  } catch (notifError) {
    console.error("Failed to create dashboard notification:", notifError);
  }

  const settings = await SiteSettings.findOne();
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#4CAF50";

  const mailOptions = {
    from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
    to: newContact.email,
    subject: "Thank You for Contacting Us",
    html: confirmationEmailTemplate(
      newContact.name,
      siteLogo,
      siteTitle,
      primaryColor,
    ),
  };

  await transporter.sendMail(mailOptions);

  res
    .status(200)
    .json({ message: "Contact saved and email sent successfully" });
};

export const getAllContactMessages = async (req, res) => {
  const contact = await Contacts.find().lean();
  res.status(200).json({ data: contact });
};

export const editContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number, message } = req.body;

  const updatedContact = await Contacts.findByIdAndUpdate(
    id,
    { name, email, phone_number, message },
    { new: true, runValidators: true },
  );

  if (!updatedContact) {
    return res.status(404).json({ message: "Contact message not found" });
  }

  res.status(200).json({
    message: "Contact Message updated successfully",
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const deletedContact = await Contacts.findByIdAndDelete(id);

  if (!deletedContact)
    return res.status(404).json({ error: "Contact Message not found" });

  res.status(200).json({
    success: true,
    message: "Contact Message deleted successfully",
  });
};

export const replyToContact = async (req, res) => {
  const { email, subject, name, message } = req.body;

  const settings = await SiteSettings.findOne();
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#4CAF50";

  const mailOptions = {
    from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: ReplyEmailTemplate(name, message, siteLogo, siteTitle, primaryColor),
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: "Email sent successfully!" });
};
