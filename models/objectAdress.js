import mongoose from 'mongoose';

const objectAdressSchema = new mongoose.Schema({
    objectId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Object'
    },
    adress: {
        type: String,
        required: true
    },
    floors: {
       type: mongoose.Schema.Types.Mixed,
       required: true
    }
}, { timestamps: true });

export const objectAdressModel = new mongoose.model('ObjectAdress', objectAdressSchema);