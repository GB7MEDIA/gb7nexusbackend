import mongoose from 'mongoose';

const channelUserSchema = new mongoose.Schema({
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
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export const channelUserModel = new mongoose.model('ChannelUser', channelUserSchema);