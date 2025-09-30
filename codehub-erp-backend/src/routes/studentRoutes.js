const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

// @route   GET /api/students
// @desc    Get all students
// @access  Private/Admin
router.get('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student', 'sales_person']), studentController.getStudents);

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', protect, studentController.getStudent);

// @route   POST /api/students
// @desc    Register a new student
// @access  Private/SalesPerson
router.post('/', protect, roleBasedAccess(['super_admin', 'sales_person', 'admin']), studentController.registerStudent);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private/Admin
router.put('/:id', protect, roleBasedAccess(['super_admin', 'admin', 'sales_person']), studentController.updateStudent);

// @route   POST /api/students/:id/trial-decision
// @desc    Handle trial decision
// @access  Private/SalesPerson
router.post(
  '/:id/trial-decision',
  protect,
  roleBasedAccess(['super_admin', 'sales_person', 'admin']),
  studentController.handleTrialDecision
);

// @route   GET /api/students/:id/attendance
// @desc    Get student attendance
// @access  Private
router.get('/:id/attendance', protect, studentController.getStudentAttendance);

// @route   GET /api/students/:id/fees
// @desc    Get student fees
// @access  Private
router.get('/:id/fees', protect, studentController.getStudentFees);

module.exports = router;