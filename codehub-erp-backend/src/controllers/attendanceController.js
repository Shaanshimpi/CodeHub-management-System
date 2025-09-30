const Attendance = require('../models/attendanceModel');
const Student = require('../models/studentModel');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin or Private/Trainer
const getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.batchId) {
      const studentsInBatch = await Student.find({ batchId: req.query.batchId }).select('_id');
      filter.studentId = { $in: studentsInBatch.map(s => s._id) };
    }
    // If user is a trainer, only show attendance they've marked.
    // Admin/Superadmin can see all.
    if (req.user?.role === 'trainer') {
      filter.trainerId = req.user._id;
    }
    console.log('[attendanceController.getAttendance] filter:', JSON.stringify(filter));
    const attendance = await Attendance.find(filter)
      .populate('studentId', 'studentId batchId')
      .populate('courseId', 'name')
      .populate('trainerId', 'name');
    console.log('[attendanceController.getAttendance] found:', attendance.length);
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Admin or Private/Trainer
const createAttendance = async (req, res, next) => {
  try {
    const { studentId, courseId, status, notes } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    // Check if student is assigned to the course
    if (!student.assignedCourses.includes(courseId)) {
      res.status(400);
      throw new Error('Student is not assigned to this course');
    }
    
    const attendance = await Attendance.create({
      studentId,
      batchId: student.batchId,
      courseId,
      trainerId: req.user._id,
      date: new Date(),
      status,
      notes
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin or Private/Trainer
const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      res.status(404);
      throw new Error('Attendance record not found');
    }
    
    const isSuperAdmin = req.user.role === 'super_admin';
    const isAdmin = req.user.role === 'admin';
    const isOwner = attendance.trainerId.toString() === req.user._id.toString();

    // Allow update if user is super_admin, admin, or the trainer who created the record
    if (!isSuperAdmin && !isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to update this attendance record');
    }
    
    attendance.status = req.body.status || attendance.status;
    attendance.notes = req.body.notes || attendance.notes;
    
    const updatedAttendance = await attendance.save();
    
    res.json(updatedAttendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create attendance records
// @route   POST /api/attendance/bulk
// @access  Private/Admin or Private/Trainer
const createBulkAttendance = async (req, res, next) => {
  try {
    const { date, records, batchId, courseId, status, notes } = req.body;

    let studentsToProcess = [];
    if (batchId) {
      // Mode 1: Get all students from a batch
      studentsToProcess = await Student.find({ batchId });
    } else if (records) {
      // Mode 2: Get specific students from the records array
      const studentIds = records.map(record => record.studentId);
      studentsToProcess = await Student.find({ _id: { $in: studentIds } });
    } else {
        res.status(400);
        throw new Error('Either batchId or records must be provided');
    }
    
    const attendanceRecords = studentsToProcess.map(student => ({
      studentId: student._id,
      batchId: student.batchId, // Get batchId from the student document
      courseId: courseId, // Use top-level courseId
      trainerId: req.user._id,
      date: new Date(date),
      status: status, // Use top-level status
      notes: notes || ''
    }));
    
    const createdRecords = await Attendance.insertMany(attendanceRecords);
    console.log('[attendanceController.createBulkAttendance] created count:', createdRecords.length);
    
    res.status(201).json(createdRecords);
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    const allowedRoles = ['super_admin', 'admin', 'sales_person', 'trainer'];
    const isAllowedRole = allowedRoles.includes(req.user.role);
    const isStudentOwner = req.user.role === 'student' && student.userId.toString() === req.user._id.toString();

    if (!isAllowedRole && !isStudentOwner) {
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

// @desc    Get attendance marked by a trainer
// @route   GET /api/attendance/trainer/:trainerId
// @access  Private/Admin
const getTrainerAttendance = async (req, res, next) => {
  try {
    const isSuperAdmin = req.user.role === 'super_admin';
    const isAdmin = req.user.role === 'admin';
    const isTrainerOwner = req.params.trainerId === req.user._id.toString();

    // Allow access if user is super_admin, admin, or the trainer themselves
    if (!isSuperAdmin && !isAdmin && !isTrainerOwner) {
      res.status(403);
      throw new Error('Not authorized to access this trainer\'s attendance records');
    }
    
    const attendance = await Attendance.find({ trainerId: req.params.trainerId })
      .populate('studentId', 'studentId')
      .populate('courseId', 'name')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
  createBulkAttendance,
  getStudentAttendance,
  getTrainerAttendance
};
