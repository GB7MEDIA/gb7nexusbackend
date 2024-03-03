import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendMail = async (to, subject, text) => {
    const MailOptions = {
        from: `"Customer Experience App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(MailOptions);
        console.log("The Email was successfully sent! Message Id: ", info.messageId);
        return true;
    } catch (error) {
        console.error("There was an error sending an email!", error.message); 
        return false;
    }
}