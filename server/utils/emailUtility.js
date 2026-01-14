const transporter = require("../middleware/mailMiddleware");
const { SiteSettings } = require("../models/SiteSettings");

const getLocalizedName = (nameObj) => {
  if (!nameObj) return "Product";
  if (typeof nameObj === "string") return nameObj;
  return (
    nameObj.en ||
    nameObj.fr ||
    nameObj.ar ||
    Object.values(nameObj)[0] ||
    "Product"
  );
};

const generateEmailTemplate = (settings, title, message, contentHtml = "") => {
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#15803d";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        ${
          siteLogo
            ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-height: 60px; width: auto;" />`
            : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
        }
      </div>
      <div style="border-top: 4px solid ${primaryColor}; padding-top: 20px;">
        <h2 style="color: #333; text-align: center;">${title}</h2>
        <div style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          ${message}
        </div>
        ${contentHtml}
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
          <p>© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  `;
};

const sendOrderStatusEmail = async (order, customer, action) => {
  const { _id, status, cart_total_price, order_date, order_items } = order;
  const { first_name, last_name, email } = customer;

  const settings = await SiteSettings.findOne();
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#15803d";

  let subject = "";
  let title = "";
  let message = "";

  if (action === "created") {
    subject = `${siteTitle} - Order Confirmation #${_id
      .toString()
      .slice(-5)
      .toUpperCase()}`;
    title = "Thank you for your order!";
    message = `Hi ${first_name}, your order has been received and is currently being processed. We'll notify you when it's on its way!`;
  } else if (action === "updated") {
    subject = `${siteTitle} - Order Update #${_id
      .toString()
      .slice(-5)
      .toUpperCase()}`;
    title = "Your order status has been updated";
    message = `Hi ${first_name}, the status of your order #${_id
      .toString()
      .slice(-5)
      .toUpperCase()} is now: <strong style="color: ${primaryColor}">${status.toUpperCase()}</strong>.`;
  }

  const itemsHtml = order_items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${getLocalizedName(
        item.product_id?.product_name,
      )}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(
        2,
      )} DH</td>
    </tr>
  `,
    )
    .join("");

  const summaryHtml = `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold; color: #333;">Order Summary</p>
      <p style="margin: 5px 0; color: #666;">Order ID: #${_id
        .toString()
        .slice(-5)
        .toUpperCase()}</p>
      <p style="margin: 5px 0; color: #666;">Date: ${new Date(
        order_date,
      ).toLocaleDateString()}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f1f1f1;">
          <th style="padding: 10px; text-align: left;">Item</th>
          <th style="padding: 10px; text-align: center;">Qty</th>
          <th style="padding: 10px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: ${primaryColor};">${cart_total_price.toFixed(
            2,
          )} DH</td>
        </tr>
      </tfoot>
    </table>
  `;

  const html = generateEmailTemplate(settings, title, message, summaryHtml);

  try {
    await transporter.sendMail({
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Error sending order status email:`, error);
  }
};

const sendVendorApplicationEmail = async (customer, vendorData) => {
  const { first_name, email } = customer;
  const settings = await SiteSettings.findOne();
  const siteTitle = settings?.website_title?.en || "GreenVille";

  const title = "Vendor Application Received";
  const message = `Hi ${first_name}, thank you for applying to become a vendor at ${siteTitle}! <br><br> Your application for <strong>"${vendorData.store_name}"</strong> is now under review. We will notify you once it has been processed.`;

  const html = generateEmailTemplate(settings, title, message);

  try {
    await transporter.sendMail({
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${siteTitle} - Vendor Application Received`,
      html,
    });
  } catch (error) {
    console.error(`Error sending vendor application email:`, error);
  }
};

const sendReviewNotificationEmail = async (customer, product, review) => {
  const { first_name, email } = customer;
  const settings = await SiteSettings.findOne();
  const siteTitle = settings?.website_title?.en || "GreenVille";

  const title = "Thank you for your review!";
  const message = `Hi ${first_name}, thank you for sharing your feedback on <strong>"${getLocalizedName(
    product.product_name,
  )}"</strong>. Your review has been submitted and will be visible shortly.`;

  const reviewHtml = `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${
      settings?.theme?.primary_color || "#15803d"
    }">
      <p style="margin: 0; font-style: italic; color: #555;">"${
        review.comment
      }"</p>
      <p style="margin: 10px 0 0; font-weight: bold; color: #333;">Rating: ${
        review.rating
      }/5</p>
    </div>
  `;

  const html = generateEmailTemplate(settings, title, message, reviewHtml);

  try {
    await transporter.sendMail({
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${siteTitle} - Review Received`,
      html,
    });
  } catch (error) {
    console.error(`Error sending review notification email:`, error);
  }
};

const sendSecurityAlertEmail = async (customer, action) => {
  const { first_name, email } = customer;
  const settings = await SiteSettings.findOne();
  const siteTitle = settings?.website_title?.en || "GreenVille";

  let title = "Security Alert";
  let message = "";

  if (action === "password_changed") {
    message = `Hi ${first_name}, this is a notification that your account password has been successfully changed. <br><br> If you did not perform this action, please contact our support team immediately.`;
  } else if (action === "password_reset_success") {
    message = `Hi ${first_name}, your password has been successfully reset. <br><br> You can now log in with your new password. If you did not perform this action, please contact our support team immediately.`;
  } else if (action === "email_updated") {
    message = `Hi ${first_name}, your account email address has been updated. <br><br> If you did not perform this action, please contact our support team immediately.`;
  } else if (action === "account_deleted") {
    message = `Hi ${first_name}, your account on ${siteTitle} has been successfully deleted as per your request. <br><br> We're sorry to see you go! If this was a mistake, please contact us.`;
    title = "Account Deleted";
  }

  const html = generateEmailTemplate(settings, title, message);

  try {
    await transporter.sendMail({
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${siteTitle} - Security Notification`,
      html,
    });
  } catch (error) {
    console.error(`Error sending security alert email:`, error);
  }
};

const sendPaymentConfirmationEmail = async (customer, order, payment) => {
  const { first_name, email } = customer;
  const settings = await SiteSettings.findOne();
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#15803d";

  const title = "Payment Received";
  const message = `Hi ${first_name}, we've successfully received your payment of <strong>${
    payment.amount
  } ${payment.currency}</strong> for order <strong>#${order._id
    .toString()
    .slice(-5)
    .toUpperCase()}</strong>.`;

  const paymentHtml = `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold; color: #333;">Payment Details</p>
      <p style="margin: 5px 0; color: #666;">Amount: ${payment.amount} ${
        payment.currency
      }</p>
      <p style="margin: 5px 0; color: #666;">Method: ${payment.paymentMethod
        .replace("_", " ")
        .toUpperCase()}</p>
      <p style="margin: 5px 0; color: #666;">Status: <strong style="color: ${primaryColor}">${payment.paymentStatus.toUpperCase()}</strong></p>
    </div>
  `;

  const html = generateEmailTemplate(settings, title, message, paymentHtml);

  try {
    await transporter.sendMail({
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${siteTitle} - Payment Received`,
      html,
    });
  } catch (error) {
    console.error(`Error sending payment confirmation email:`, error);
  }
};

module.exports = {
  sendOrderStatusEmail,
  sendVendorApplicationEmail,
  sendReviewNotificationEmail,
  sendSecurityAlertEmail,
  sendPaymentConfirmationEmail,
};
