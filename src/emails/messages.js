const sendWelcomeEmail = async ({ name }) => {
    return {
    subject: 'Welcome to Task Manager!',
    html: `<p>Welcome to Task Manager, ${name}! Let me know you get along with the app.</p>`,
    text: `Welcome to Task Manager, ${name}! Let me know you get along with the app.`,
    };
};
const sendCancelEmail = async ({ name }) => {
    return {
    subject: `We're sorry to see you go, ${name}. :(`,
    html: `<p>Hey ${name}, we saw you deleted your Task Manager account. We are sorry to see you leave us. If you have a few moments to share your thoughts on what we could do better in the future, hit Reply and let us know. All the best, Sarah.</p>`,
    text: `Hey ${name}, we saw you deleted your Task Manager account. We are sorry to see you leave us. If you have a few moments to share your thoughts on what we could do better in the future, hit Reply and let us know. All the best, Sarah.`,
    };
};

module.exports = { sendWelcomeEmail, sendCancelEmail };
