import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const isSecure = process.env.SMTP_SECURE === "true";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});