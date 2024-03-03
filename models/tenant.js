import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true
    },
    objectId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Object'
    }
}, { timestamps: true });

export const tenantModel = new mongoose.model('Tenant', tenantSchema);