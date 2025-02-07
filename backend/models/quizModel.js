const mongoose = require('mongoose');

const quizSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
            enum: ['Mathematics', 'Science', 'History', 'Geography', 'Literature', 'General Knowledge']
        },
        difficulty: {
            type: String,
            required: [true, 'Please add difficulty level'],
            enum: ['Beginner', 'Intermediate', 'Advanced']
        },
        timeLimit: {
            type: Number,  // Time limit in minutes
            required: [true, 'Please add time limit']
        },
        points: {
            type: Number,
            required: [true, 'Please add points value']
        },
        questions: [{
            questionText: {
                type: String,
                required: true
            },
            options: [{
                text: {
                    type: String,
                    required: true
                },
                isCorrect: {
                    type: Boolean,
                    required: true
                }
            }],
            explanation: {
                type: String,
                required: true
            }
        }],
        badges: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        }],
        active: {
            type: Boolean,
            default: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Quiz', quizSchema);
