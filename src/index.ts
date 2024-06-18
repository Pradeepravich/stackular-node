import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,        
        pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', (req, res) => {
  const { name, message } = req.body;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: `${process.env.EMAIL_TO}`,
    subject: `Contact form submission from ${name}`,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
