import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    };

    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}`, options);
        console.log("Connected to Database");
    } catch (error) {
        console.error("There was an error connecting to the database!", error);
    }
}