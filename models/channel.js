import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    channelname: {
        type: String,
        required: true
    },
    channelrights: {
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

export const channelModel = new mongoose.model('Channel', channelSchema);