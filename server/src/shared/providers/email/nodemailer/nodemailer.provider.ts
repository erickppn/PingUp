import nodemailer from 'nodemailer';
import { SendMail, SendMailData } from '@/shared/providers/email/mail.provider';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendMail: SendMail = async (data: SendMailData) => {
  const { body, subject, to } = data;

  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body
    });
  } catch (error) {
    console.log(error);
  }
}