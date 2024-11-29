const nodemailer = require('nodemailer');
const emailConfig = require('../config/email')

const transporter = nodemailer.createTransport(emailConfig)

async function sendWelcomeEmail(name, email) {
    try {
        await transporter.sendMail({
            from: "'HPC <higherpursuitsclub@gmail.com>",
            to: email,
            subject: 'Welcome to HPC',
            html: `
            <h1>Welcome to HPC, ${name}. Thanks for joining.</h1>
            `
        });
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
}