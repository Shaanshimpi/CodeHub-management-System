const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

// @route   GET /api/courses
// @desc    Get all active courses
// @access  Public
router.get('/', courseController.getCourses);

// @route   GET /api/courses/all
// @desc    Get all courses (including inactive)
// @access  Private/Admin
router.get('/all', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), courseController.getAllCourses);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', courseController.getCourse);

// @route   POST /api/courses
// @desc    Create course
// @access  Private/Admin
router.post('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), courseController.createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin
router.put('/:id', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), courseController.updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), courseController.deleteCourse);

module.exports = router;