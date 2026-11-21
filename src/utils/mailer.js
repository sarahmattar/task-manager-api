// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '127.0.0.1',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  ignoreTLS: true, // Mailpit does not use TLS on port 1025
  // No auth block needed for local Mailpit
});

// A failed send is logged, not thrown, so an SMTP outage can't fail the
// request that triggered the email (e.g. leave an account undeleted).
async function sendEmail({ to, subject, html, text }) {
	try {
		return await transporter.sendMail({
			from: `"My Local App" <${process.env.MAIL_FROM}>`,
			to,
			subject,
			text,
			html,
		});
	} catch (error) {
		console.error(`Failed to send email "${subject}":`, error.message);
	}
}

module.exports = { sendEmail };
