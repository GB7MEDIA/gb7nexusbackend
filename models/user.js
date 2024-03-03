import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
    tfaSetting: {
        type: String,
        required: true,
        default: 'false',
        enum: ['false', 'email', 'sms']
    },
    tfaCode: String
}, { timestamps: true });

export const userModel = new mongoose.model('User', userSchema);