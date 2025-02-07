const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a badge name'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        icon: {
            type: String,
            required: [true, 'Please add an icon URL']
        },
        criteria: {
            type: {
                type: String,
                required: true,
                enum: ['QUIZ_SCORE', 'QUIZ_COUNT', 'POINTS', 'STREAK']
            },
            value: {
                type: Number,
                required: true
            },
            subject: String,  // Optional: specific subject requirement
            difficulty: String  // Optional: specific difficulty requirement
        },
        points: {
            type: Number,
            required: true
        },
        rarity: {
            type: String,
            required: true,
            enum: ['Common', 'Rare', 'Epic', 'Legendary']
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Badge', badgeSchema);
