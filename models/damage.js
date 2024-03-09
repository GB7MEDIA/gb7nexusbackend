import mongoose from 'mongoose';

const damageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mediaUrl: {
        type: String,
        required: false,
        default: ""
    },
    objectId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Object' 
    },
    adressId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'ObjectAdress'  
    },
    floor: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    damageStatus: {
        type: String,
        required: true,
        default: 'received',
        enum: ['received', 'inProgress', 'finished']
    }
}, { timestamps: true });

export const damageModel = new mongoose.model('Damage', damageSchema);