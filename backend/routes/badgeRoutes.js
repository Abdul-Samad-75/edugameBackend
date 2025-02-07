const express = require('express');
const router = express.Router();
const {
    createBadge,
    getBadges,
    checkAndAwardBadges,
} = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBadge)
    .get(protect, getBadges);

router.post('/check', protect, checkAndAwardBadges);

module.exports = router;
