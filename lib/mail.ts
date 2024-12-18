import nodemailer from "nodemailer";

// Create a transporter using SMTP settings (you can replace these with your SMTP provider's details)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // or 465 for secure connections
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your SMTP user
    pass: process.env.SMTP_PASS, // Your SMTP password
  },
});

// Common email template function
const generateEmailTemplate = (
  title: string,
  message: string,
  actionLink: string,
  actionText: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
      <h2 style="color: #333;">${title}</h2>
      <p style="color: #555;">${message}</p>
      <a href="${actionLink}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">${actionText}</a>
      <p style="color: #777; margin-top: 20px;">This link will expire in 1 hour.</p>
      <p style="color: #777; margin-top: 20px;">If you did not request this email, please ignore it.</p>
    </div>
  `;
};

// 2FA Email Template
const generateTwoFactorEmailTemplate = (code: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #333;">Your 2-Factor Authentication Code</h2>
      <p style="color: #555;">Use the code below to complete your login:</p>
      <p style="color: #777;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
      <div style="font-size: 24px; font-weight: bold; color: #007BFF; padding: 15px; background-color: #fff; border-radius: 8px; text-align: center; margin: 20px 0;">
        ${code}
      </div>
    </div>
  `;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
  const title = "Reset Your Password";
  const message =
    "You requested a password reset. Please click the button below to create a new password.";
  const actionText = "Reset Password";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // recipient email
      subject: title,
      html: generateEmailTemplate(title, message, resetLink, actionText),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
  const title = "Confirm Your Email";
  const message =
    "Thank you for registering! Please confirm your email address by clicking the button below.";
  const actionText = "Confirm Email";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // recipient email
      subject: title,
      html: generateEmailTemplate(title, message, confirmLink, actionText),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const title = "Your 2-Factor Authentication Code";
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // recipient email
      subject: title,
      html: generateTwoFactorEmailTemplate(token),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
