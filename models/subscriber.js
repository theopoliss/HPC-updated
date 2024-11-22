const mongoose = require('mongoose');
const { stringify } = require('querystring');

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

subscriberSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', subscriberSchema)