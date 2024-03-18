import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

import { connectDB } from "./config/db.js";
import { AllRoutes } from "./routes/index.js";
import { generateCode } from "./utils/index.js";

const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, new Date().toISOString().slice(0, 10).replace(/:/g, '-') + '-' + generateCode(file.originalname) + ext);
    },
});

const upload = multer({ storage: fileStorageEngine });

app.post('/api/upload/one', upload.single('file'), (req, res) => {
    if (req.file) {
        return res.status(200).json({ message: "Successfully uploaded images", data: { mediaUrl: req.file.filename } });
    } else {
        return res.status(400).json({ message: "No file uploaded!" });
    }
});

app.post('/api/upload/multiple', upload.array('files', 5), (req, res) => {
    if (req.files && req.files.length > 0) {
        const uploadedFiles = req.files.map(file => file.filename);
        return res.status(200).json({ message: "Successfully uploaded images", data: { mediaUrls: uploadedFiles } });
    } else {
        return res.status(400).json({ message: "No files uploaded" });
    }
});

app.use('/', AllRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}!`);
});

