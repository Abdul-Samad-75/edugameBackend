const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['QUIZ_COMPLETION', 'BADGE_EARNED', 'LEVEL_UP', 'STREAK_MILESTONE']
        },
        details: {
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            badge: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Badge'
            },
            level: Number,
            streak: Number,
            points: Number
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient user achievement queries
achievementSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
