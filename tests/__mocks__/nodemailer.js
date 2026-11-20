// Tests never send real email. Every transport shares one sendMail mock, so a
// test can make it fail with:
//   require('nodemailer').createTransport().sendMail.mockRejectedValueOnce(...)
const sendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });

module.exports = {
	createTransport: jest.fn(() => ({ sendMail })),
};
