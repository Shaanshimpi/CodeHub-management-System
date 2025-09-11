const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Fee = require('../models/feeModel');
const { generateToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const config = require('../config/config');
const { default: mongoose } = require('mongoose');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.batchId) {
      query.batchId = req.query.batchId;
    }
    if (req.user?.role === 'trainer') {
      // Trainers should only see students assigned to them
      query.$or = [
        { assignedTrainer: req.user._id },
        { assignedTrainer: { $exists: false } },
        { assignedTrainer: null }
      ];
    }
    console.log('[studentsController.getStudents] query:', JSON.stringify(query));
    const students = await Student.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedTrainer', 'name')
      .populate('batchId', 'name slot')
      .populate('salesPerson', 'name')
      .populate('assignedCourses', 'name');
    console.log('[studentsController.getStudents] found:', students.length);
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedTrainer', 'name')
      .populate('batchId', 'name slot')
      .populate('salesPerson', 'name')
      .populate('assignedCourses', 'name description duration totalFees');
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Check if the requesting user has access to this student
    if (req.user.role === 'student' && student.userId._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this student');
    }
    
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new student
// @route   POST /api/students
// @access  Private/SalesPerson
const registerStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, email, phone, password, assignedCourses, assignedTrainer, batchId } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email }).session(session);
    if (userExists) {
      await session.abortTransaction();
      res.status(400);
      throw new Error('User already exists');
    }
    
    // Create user account
    const user = await User.create([{
      _id: new mongoose.Types.ObjectId(),
      salesPerson: req.user._id,
      name,
      email,
      phone,
      password,
      role: 'student'
    }], { session });
    
    // Create student record
    const student = await Student.create([{
      userId: user[0]._id,
      salesPerson: req.user._id,
      assignedCourses,
      assignedTrainer,
      batchId,
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'trial'
    }], { session });
    
    await session.commitTransaction();
    
    // Send welcome email
    const message = `
      <h1>Welcome to CodeHub India!</h1>
      <p>Your student account has been created successfully.</p>
      <p>Your Student ID: ${student[0].studentId}</p>
      <p>Please complete your registration by paying the ₹2000 registration fee.</p>
      <p>This gives you access to a 1-week trial period.</p>
    `;
    
    await sendEmail({
      email: user[0].email,
      subject: 'Welcome to CodeHub India',
      message
    });
    
    res.status(201).json({
      _id: student[0]._id,
      studentId: student[0].studentId,
      userId: {
        _id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone
      },
      status: student[0].status,
      trialStartDate: student[0].trialStartDate,
      trialEndDate: student[0].trialEndDate,
      registrationFee: student[0].registrationFee
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Update basic info
    if (req.body.assignedCourses) {
      student.assignedCourses = req.body.assignedCourses;
    }
    
    if (req.body.assignedTrainer) {
      student.assignedTrainer = req.body.assignedTrainer;
    }
    if (req.body.batchId) {
      student.batchId = req.body.batchId;
    }
    
    if (req.body.status) {
      student.status = req.body.status;
    }
    
    // Update registration fee payment status
    if (req.body.registrationFee) {
      if (req.body.registrationFee.paid !== undefined) {
        student.registrationFee.paid = req.body.registrationFee.paid;
        student.registrationFee.paidDate = req.body.registrationFee.paid ? new Date() : undefined;
      }
      
      if (req.body.registrationFee.refunded !== undefined) {
        student.registrationFee.refunded = req.body.registrationFee.refunded;
        student.registrationFee.refundDate = req.body.registrationFee.refunded ? new Date() : undefined;
      }
    }
    
    const updatedStudent = await student.save();
    
    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// @desc    Handle trial decision
// @route   POST /api/students/:id/trial-decision
// @access  Private/SalesPerson
const handleTrialDecision = async (req, res, next) => {
  try {
    const { decision } = req.body;
    const student = await Student.findById(req.params.id).populate('userId', 'email name');
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    if (student.status !== 'trial') {
      res.status(400);
      throw new Error('Student is not in trial period');
    }
    
    if (!student.registrationFee.paid) {
      res.status(400);
      throw new Error('Registration fee not paid');
    }
    
    if (decision === 'continue') {
      // Convert registration fee to course fee credit
      const course = await Course.findOne({ _id: { $in: student.assignedCourses } });
      
      if (!course) {
        res.status(400);
        throw new Error('No assigned course found');
      }
      
      // Create a fee adjustment record
      const fee = await Fee.create({
        studentId: student._id,
        courseId: course._id,
        amount: -2000,
        dueDate: new Date(),
        paidDate: new Date(),
        status: 'paid',
        paymentMethod: 'registration_adjustment',
        createdBy: req.user._id
      });
      
      // Update student status
      student.status = 'active';
      await student.save();
      
      // Send confirmation email
      const message = `
        <h1>Welcome to CodeHub India as a full student!</h1>
        <p>Your trial period has been successfully converted to a full enrollment.</p>
        <p>Your ₹2000 registration fee has been applied to your course fees.</p>
      `;
      
      await sendEmail({
        email: student.userId.email,
        subject: 'Trial Period Conversion',
        message
      });
      
      res.json({
        message: 'Student trial converted to active enrollment',
        feeAdjustment: fee
      });
    } else if (decision === 'discontinue') {
      // Process refund
      student.status = 'inactive';
      student.registrationFee.refunded = true;
      student.registrationFee.refundDate = new Date();
      await student.save();
      
      // Send refund confirmation email
      const message = `
        <h1>Your trial period has ended</h1>
        <p>We're sorry to see you go. Your ₹2000 registration fee will be refunded.</p>
        <p>Thank you for trying CodeHub India.</p>
      `;
      
      await sendEmail({
        email: student.userId.email,
        subject: 'Trial Period Ended',
        message
      });
      
      res.json({
        message: 'Student trial discontinued and refund processed'
      });
    } else {
      res.status(400);
      throw new Error('Invalid decision');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private
const getStudentAttendance = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Check if the requesting user has access to this student's attendance
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this student\'s attendance');
    }
    
    if (req.user.role === 'trainer' && student.assignedTrainer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this student\'s attendance');
    }
    
    const attendance = await Attendance.find({ studentId: student._id })
      .populate('courseId', 'name')
      .populate('trainerId', 'name')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student fees
// @route   GET /api/students/:id/fees
// @access  Private
const getStudentFees = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Check if the requesting user has access to this student's fees
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this student\'s fees');
    }
    
    const fees = await Fee.find({ studentId: student._id })
      .populate('courseId', 'name totalFees')
      .populate('createdBy', 'name')
      .sort({ dueDate: 1 });
    
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  registerStudent,
  updateStudent,
  handleTrialDecision,
  getStudentAttendance,
  getStudentFees
};