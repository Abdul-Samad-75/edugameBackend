const { check } = require('express-validator');

const createQuizValidator = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),

    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters'),

    check('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isIn(['Mathematics', 'Science', 'History', 'Geography', 'Literature', 'General Knowledge'])
        .withMessage('Invalid subject'),

    check('difficulty')
        .trim()
        .notEmpty()
        .withMessage('Difficulty is required')
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Invalid difficulty level'),

    check('timeLimit')
        .isInt({ min: 1, max: 180 })
        .withMessage('Time limit must be between 1 and 180 minutes'),

    check('points')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Points must be between 1 and 1000'),

    check('questions')
        .isArray({ min: 1 })
        .withMessage('At least one question is required'),

    check('questions.*.questionText')
        .trim()
        .notEmpty()
        .withMessage('Question text is required'),

    check('questions.*.options')
        .isArray({ min: 2, max: 4 })
        .withMessage('Each question must have 2-4 options'),

    check('questions.*.options.*.text')
        .trim()
        .notEmpty()
        .withMessage('Option text is required'),

    check('questions.*.options.*.isCorrect')
        .isBoolean()
        .withMessage('isCorrect must be a boolean value'),

    check('questions.*.explanation')
        .trim()
        .notEmpty()
        .withMessage('Explanation is required')
];

const submitQuizValidator = [
    check('answers')
        .isArray()
        .withMessage('Answers must be an array')
        .custom((answers, { req }) => {
            if (!Array.isArray(answers)) return false;
            return answers.every(answer => typeof answer === 'string');
        })
        .withMessage('Each answer must be a string')
];

module.exports = {
    createQuizValidator,
    submitQuizValidator
};
