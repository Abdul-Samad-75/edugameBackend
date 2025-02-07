const express = require('express');
const router = express.Router();
const {
    getGlobalLeaderboard,
    getSubjectLeaderboard,
    getUserRanking,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGlobalLeaderboard);
router.get('/subject/:subject', protect, getSubjectLeaderboard);
router.get('/rank', protect, getUserRanking);

module.exports = router;
