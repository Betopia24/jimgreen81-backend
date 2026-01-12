import config from "../config";
import nodemailer from "nodemailer";

export const sendEmail = async (data: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: config.mail.SMTP_HOST,
    port: config.mail.SMTP_PORT,
    secure: false,
    auth: {
      user: config.mail.SMTP_HOST_EMAIL,
      pass: config.mail.SMTP_APP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"Faithly" <${config.mail.SMTP_FROM}>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });

  console.log("Message sent: %s", info.messageId);
};
