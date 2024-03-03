import mongoose from 'mongoose';

const channelMessageSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Channel'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const channelMessageModel = new mongoose.model('ChannelMessage', channelMessageSchema);