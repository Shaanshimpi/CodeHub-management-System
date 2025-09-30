const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/SuperAdmin
router.get('/', protect, roleBasedAccess(['super_admin', 'admin']), userController.getUsers);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateUserProfile);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/:id', protect, roleBasedAccess(['super_admin', 'admin']), userController.getUser);

// @route   POST /api/users
// @desc    Create user
// @access  Private/Admin
router.post('/', protect, roleBasedAccess(['super_admin', 'admin']), userController.createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', protect, roleBasedAccess(['super_admin', 'admin']), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/SuperAdmin
router.delete('/:id', protect, roleBasedAccess(['super_admin', 'admin']), userController.deleteUser);

module.exports = router;