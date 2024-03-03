import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    chatname: {
        type: String,
        required: true
    },
    chatrights: {
        type: String,
        required: true,
        default: 'everyone',
        enum: ['admins', 'everyone']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

export const chatModel = new mongoose.model('Chat', chatSchema);