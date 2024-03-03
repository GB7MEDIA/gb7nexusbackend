import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}`);
        console.log("Connected to Database");
    } catch (error) {
        console.error("There was an error connecting to the database!", error);
        process.exit(1);
    }
}