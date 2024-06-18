import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface MailRequestBody {
  name: string;
  email: string;
  message: string;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request: No body in request' }),
    };
  }

  const { name, email, message }: MailRequestBody = JSON.parse(event.body);

  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: `Contact form submission from ${name}`,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', info }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error }),
    };
  }
};
