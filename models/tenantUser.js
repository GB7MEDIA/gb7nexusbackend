import mongoose from 'mongoose';

const tenantUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tenantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Tenant'
    }
}, { timestamps: true });

export const tenantUserModel = new mongoose.model('TenantUser', tenantUserSchema);