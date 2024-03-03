import mongoose from 'mongoose';

const chatUserSchema = new mongoose.Schema({
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
    isAdmin: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export const chatUserModel = new mongoose.model('ChatUser', chatUserSchema);