const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getQuizzes,
    getQuizById,
    submitQuiz,
} = require('../controllers/quizController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { createQuizValidator, submitQuizValidator } = require('../validators/quizValidators');

router.route('/')
    .post(protect, admin, createQuizValidator, validateRequest, createQuiz)
    .get(protect, getQuizzes);

router.route('/:id')
    .get(protect, getQuizById);

router.route('/:id/submit')
    .post(protect, submitQuizValidator, validateRequest, submitQuiz);

module.exports = router;
