const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

// @route   GET /api/attendance
// @desc    Get all attendance records
// @access  Private/Admin
router.get('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer']), attendanceController.getAttendance);

// @route   POST /api/attendance
// @desc    Create attendance record
// @access  Private/Trainer
router.post('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer']), attendanceController.createAttendance);

// @route   PUT /api/attendance/:id
// @desc    Update attendance record
// @access  Private/Trainer
router.put('/:id', protect, roleBasedAccess(['super_admin', 'admin', 'trainer']), attendanceController.updateAttendance);

// @route   POST /api/attendance/bulk
// @desc    Bulk create attendance records
// @access  Private/Trainer
router.post('/bulk', protect, roleBasedAccess(['super_admin', 'admin', 'trainer']), attendanceController.createBulkAttendance);

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance for a student
// @access  Private
router.get('/student/:studentId', protect, attendanceController.getStudentAttendance);

// @route   GET /api/attendance/trainer/:trainerId
// @desc    Get attendance marked by a trainer
// @access  Private/Admin
router.get('/trainer/:trainerId', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), attendanceController.getTrainerAttendance);

module.exports = router;