const Fee = require('../models/feeModel');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all fee records
// @route   GET /api/fees
// @access  Private/Admin
const getFees = async (req, res, next) => {
  try {
    const query = {};
    if (req.user?.role === 'sales_person') {
      const students = await Student.find({ salesPerson: req.user._id }).select('_id');
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    } else if (req.query.studentId) {
        query.studentId = req.query.studentId;
    }

    const fees = await Fee.find(query)
      .populate({
        path: 'studentId',
        select: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
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

    // Populate the fee with student and course details for email
    const populatedFee = await Fee.findById(fee._id)
      .populate({
        path: 'studentId',
        select: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('courseId', 'name');

    // Send email notification to student about fee reminder
    try {
      const studentEmail = populatedFee.studentId.userId.email;
      const studentName = populatedFee.studentId.userId.name;
      const courseName = populatedFee.courseId.name;
      
      const emailSubject = `Fee Reminder - ${courseName}`;
      const emailMessage = `
Dear ${studentName},

This is a reminder that you have a pending fee payment for the course "${courseName}".

Fee Details:
- Amount: ₹${amount.toLocaleString()}
- Due Date: ${new Date(dueDate).toLocaleDateString()}
- Student ID: ${populatedFee.studentId.studentId}

Please ensure payment is made before the due date to avoid any late fees.

If you have already made the payment, please contact your sales representative to update the records.

Best regards,
CodeHub ERP Team
      `;

      await sendEmail({
        email: studentEmail,
        subject: emailSubject,
        message: emailMessage
      });
    } catch (emailError) {
      console.error('Failed to send fee reminder email:', emailError);
      // Don't fail the request if email sending fails
    }
    
    res.status(201).json(populatedFee);
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
      .populate({
        path: 'studentId',
        select: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
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
      .populate({
        path: 'studentId',
        select: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('courseId', 'name')
      .sort({ dueDate: 1 });
    
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// @desc    Update fee status
// @route   PATCH /api/fees/:id/status
// @access  Private/Admin/SalesPerson
const updateFeeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    // Validate status
    if (!['pending', 'paid', 'overdue'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be pending, paid, or overdue');
    }
    
    const fee = await Fee.findById(id);
    
    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }
    
    // Update status
    fee.status = status;
    
    // If marking as paid, set paid date
    if (status === 'paid' && !fee.paidDate) {
      fee.paidDate = new Date();
    }
    
    // If changing from paid to another status, clear paid date
    if (status !== 'paid' && fee.paidDate) {
      fee.paidDate = null;
      fee.paymentMethod = null;
      fee.transactionId = null;
    }
    
    const updatedFee = await fee.save();
    
    // Populate the updated fee
    const populatedFee = await Fee.findById(updatedFee._id)
      .populate({
        path: 'studentId',
        select: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('courseId', 'name')
      .populate('createdBy', 'name');
    
    res.json(populatedFee);
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
  getOverdueFees,
  updateFeeStatus
};