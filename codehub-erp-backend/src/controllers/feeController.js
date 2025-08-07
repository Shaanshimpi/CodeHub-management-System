const Fee = require('../models/feeModel');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');

// @desc    Get all fee records
// @route   GET /api/fees
// @access  Private/Admin
const getFees = async (req, res, next) => {
  try {
    const fees = await Fee.find()
      .populate('studentId', 'studentId')
      .populate('courseId', 'name')
      .populate('createdBy', 'name')
      .sort({ dueDate: 1 });
    
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// @desc    Create fee record
// @route   POST /api/fees
// @access  Private/SalesPerson
const createFee = async (req, res, next) => {
  try {
    const { studentId, courseId, amount, dueDate, paymentMethod, transactionId, notes } = req.body;
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if student is assigned to the course
    if (!student.assignedCourses.includes(courseId)) {
      res.status(400);
      throw new Error('Student is not assigned to this course');
    }
    
    const fee = await Fee.create({
      studentId,
      courseId,
      amount,
      dueDate,
      paymentMethod,
      transactionId,
      notes,
      createdBy: req.user._id,
      status: 'pending'
    });
    
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update fee record
// @route   PUT /api/fees/:id
// @access  Private/SalesPerson
const updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }
    
    // Only allow updates to certain fields
    if (req.body.amount) {
      fee.amount = req.body.amount;
    }
    
    if (req.body.dueDate) {
      fee.dueDate = req.body.dueDate;
    }
    
    if (req.body.notes) {
      fee.notes = req.body.notes;
    }
    
    const updatedFee = await fee.save();
    
    res.json(updatedFee);
  } catch (error) {
    next(error);
  }
};

// @desc    Record fee payment
// @route   POST /api/fees/payment
// @access  Private/SalesPerson
const recordPayment = async (req, res, next) => {
  try {
    const { feeId, paidDate, paymentMethod, transactionId } = req.body;
    
    const fee = await Fee.findById(feeId);
    
    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }
    
    fee.paidDate = paidDate || new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    fee.status = 'paid';
    
    const updatedFee = await fee.save();
    
    res.json(updatedFee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending fees
// @route   GET /api/fees/pending
// @access  Private/SalesPerson
const getPendingFees = async (req, res, next) => {
  try {
    const fees = await Fee.find({ status: 'pending' })
      .populate('studentId', 'studentId')
      .populate('courseId', 'name')
      .sort({ dueDate: 1 });
    
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue fees
// @route   GET /api/fees/overdue
// @access  Private/SalesPerson
const getOverdueFees = async (req, res, next) => {
  try {
    const today = new Date();
    const fees = await Fee.find({ 
      status: 'overdue',
      dueDate: { $lte: today }
    })
      .populate('studentId', 'studentId')
      .populate('courseId', 'name')
      .sort({ dueDate: 1 });
    
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFees,
  createFee,
  updateFee,
  recordPayment,
  getPendingFees,
  getOverdueFees
};