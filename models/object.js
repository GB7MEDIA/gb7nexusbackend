import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema({
    objectname: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const objectModel = new mongoose.model('Object', objectSchema);