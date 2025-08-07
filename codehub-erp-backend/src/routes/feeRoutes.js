const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const feeController = require('../controllers/feeController');

// @route   GET /api/fees
// @desc    Get all fee records
// @access  Private/Admin
router.get('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'student']), feeController.getFees);

// @route   POST /api/fees
// @desc    Create fee record
// @access  Private/SalesPerson
router.post('/', protect, roleBasedAccess(['sales_person', 'admin']), feeController.createFee);

// @route   PUT /api/fees/:id
// @desc    Update fee record
// @access  Private/SalesPerson
router.put('/:id', protect, roleBasedAccess(['sales_person', 'admin']), feeController.updateFee);

// @route   POST /api/fees/payment
// @desc    Record fee payment
// @access  Private/SalesPerson
router.post('/payment', protect, roleBasedAccess(['sales_person', 'admin']), feeController.recordPayment);

// @route   GET /api/fees/pending
// @desc    Get pending fees
// @access  Private/SalesPerson
router.get('/pending', protect, roleBasedAccess(['sales_person', 'admin']), feeController.getPendingFees);

// @route   GET /api/fees/overdue
// @desc    Get overdue fees
// @access  Private/SalesPerson
router.get('/overdue', protect, roleBasedAccess(['sales_person', 'admin']), feeController.getOverdueFees);

module.exports = router;