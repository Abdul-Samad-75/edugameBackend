const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
const getGlobalLeaderboard = asyncHandler(async (req, res) => {
    const { timeframe = 'all', limit = 10 } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch(timeframe) {
        case 'daily':
            dateFilter = {
                createdAt: {
                    $gte: new Date(now.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                }
            };
            break;
        case 'weekly':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            dateFilter = {
                createdAt: {
                    $gte: new Date(startOfWeek.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                }
            };
            break;
        case 'monthly':
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = {
                createdAt: {
                    $gte: startOfMonth,
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                }
            };
            break;
    }

    const leaderboard = await User.find(dateFilter)
        .select('name points level badges')
        .sort('-points')
        .limit(parseInt(limit))
        .populate('badges', 'name icon rarity');

    res.json(leaderboard);
});

// @desc    Get subject-specific leaderboard
// @route   GET /api/leaderboard/subject/:subject
// @access  Private
const getSubjectLeaderboard = asyncHandler(async (req, res) => {
    const { subject } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await User.aggregate([
        {
            $unwind: '$completedQuizzes'
        },
        {
            $lookup: {
                from: 'quizzes',
                localField: 'completedQuizzes.quiz',
                foreignField: '_id',
                as: 'quizDetails'
            }
        },
        {
            $unwind: '$quizDetails'
        },
        {
            $match: {
                'quizDetails.subject': subject
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                totalPoints: { $sum: '$completedQuizzes.score' },
                quizzesTaken: { $sum: 1 },
                averageScore: { $avg: '$completedQuizzes.score' }
            }
        },
        {
            $sort: { totalPoints: -1 }
        },
        {
            $limit: parseInt(limit)
        }
    ]);

    res.json(leaderboard);
});

// @desc    Get user's ranking
// @route   GET /api/leaderboard/rank
// @access  Private
const getUserRanking = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userCount = await User.countDocuments();
    const userRank = await User.countDocuments({ points: { $gt: req.user.points } });

    const percentile = ((userCount - userRank) / userCount) * 100;

    const nearbyUsers = await User.find({
        points: {
            $gte: req.user.points - 100,
            $lte: req.user.points + 100
        }
    })
    .select('name points level')
    .sort('-points')
    .limit(5);

    res.json({
        rank: userRank + 1,
        totalUsers: userCount,
        percentile: Math.round(percentile * 100) / 100,
        nearbyUsers
    });
});

module.exports = {
    getGlobalLeaderboard,
    getSubjectLeaderboard,
    getUserRanking,
};
