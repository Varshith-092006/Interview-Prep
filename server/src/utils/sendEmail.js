const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter;

  // Use real SMTP if configured in .env
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || "PrepWise AI"} <${process.env.FROM_EMAIL || "noreply@prepwise.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  // If using ethereal test account, log the URL to view the email
  if (!process.env.SMTP_USER) {
    console.log("=========================================");
    console.log("Mock Email Sent!");
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("=========================================");
  }
};

module.exports = sendEmail;
