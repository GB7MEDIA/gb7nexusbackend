import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { connectDB } from "./config/db.js";
import { AllRoutes } from "./routes/index.js";

const app = express();

connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', AllRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}!`);
});
