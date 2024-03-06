import mongoose from 'mongoose';

const marketPlaceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export const marketPlaceModel = new mongoose.model('MarketPlace', marketPlaceSchema);