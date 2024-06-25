// functions/sendMail.ts
import { Handler} from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const handler: Handler = async (event) => {  
  try {
    const { name, email, message } = JSON.parse(event.body as string);

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

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Email sent successfully', info }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Failed to send email', error }),
    };
  }
};

export { handler };