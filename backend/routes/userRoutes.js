const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');


const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { registerValidator, loginValidator } = require('../validators/userValidators');

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, registerValidator, validateRequest, updateUserProfile);

module.exports = router;
