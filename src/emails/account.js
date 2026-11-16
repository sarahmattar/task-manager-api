const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Emails are fire-and-forget: callers don't await them, so a SendGrid failure
// must be caught here. An unhandled rejection would crash the Node process.
const sendEmail = async (message) => {
    try {
        await sgMail.send(message);
    } catch (error) {
        console.error(
            `Failed to send email "${message.subject}":`,
            error.response ? error.response.body : error.message
        );
    }
};

const sendWelcomeEmail = (email, name) =>
    sendEmail({
        to: email,
        from: 'sarahsabamattar@gmail.com',
        subject: 'Welcome to Task Manager!',
        text: `Welcome to Task Manager, ${name}! Let me know you get along with the app.`,
    });

const sendCancelEmail = (email, name) =>
    sendEmail({
        to: email,
        from: 'sarahsabamattar@gmail.com',
        subject: `We're sorry to see you go, ${name}. :(`,
        text: `Hey ${name}, we saw you deleted your Task Manager account. We are sorry to see you leave us. If you have a few moments to share your thoughts on what we could do better in the future, hit Reply and let us know. All the best, Sarah.`,
    });

module.exports = { sendWelcomeEmail, sendCancelEmail };
