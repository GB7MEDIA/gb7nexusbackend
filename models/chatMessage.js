import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Chat'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const chatMessageModel = new mongoose.model('ChatMessage', chatMessageSchema);