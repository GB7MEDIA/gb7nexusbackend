import twilio from 'twilio';
import 'dotenv/config';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export const sendSMS = async (to, body) => {
    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONENUMBER,
            to
        });
    
        console.log("Successfully send SMS! Message Id: ", message.sid);
        return true; 
    } catch (error) {
        console.error("There was an error sending an SMS!", error.message);
        return false;
    }
}