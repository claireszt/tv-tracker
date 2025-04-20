import nodemailer from "nodemailer";

type EmailParams = {
  to: string;
  subject: string;
  html: string;
};

export default async function sendEmail({ to, subject, html }: EmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"TV Tracker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
}
