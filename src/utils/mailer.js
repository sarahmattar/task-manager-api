// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '127.0.0.1',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  ignoreTLS: true, // Mailpit does not use TLS on port 1025
  // No auth block needed for local Mailpit
});

async function sendEmail({ to, subject, html, text }) {
	return transporter.sendMail({
		from: `"My Local App" <${process.env.MAIL_FROM}>`,
		to,
		subject,
		text,
		html,
	});
}

module.exports = { sendEmail };
