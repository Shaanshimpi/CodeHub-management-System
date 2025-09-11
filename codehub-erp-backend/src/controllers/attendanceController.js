const Attendance = require('../models/attendanceModel');
const Student = require('../models/studentModel');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin
const getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.batchId) {
      const studentsInBatch = await Student.find({ batchId: req.query.batchId }).select('_id');
      filter.studentId = { $in: studentsInBatch.map(s => s._id) };
    }
    const attendance = await Attendance.find(filter)
      .populate('studentId', 'studentId batchId')
      .populate('courseId', 'name')
      .populate('trainerId', 'name');
    
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Trainer
const createAttendance = async (req, res, next) => {
  try {
    const { studentId, courseId, status, notes } = req.body;
    
    // Check if student is assigned to trainer
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    if (student.assignedTrainer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to mark attendance for this student');
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
// @access  Private/Trainer
const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      res.status(404);
      throw new Error('Attendance record not found');
    }
    
    // Check if the requesting trainer created this record
    if (attendance.trainerId.toString() !== req.user._id.toString()) {
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
// @access  Private/Trainer
const createBulkAttendance = async (req, res, next) => {
  try {
    const { date, records, batchId, courseId, status, notes } = req.body;
    
    let students = [];
    let payloadRecords = records;
    if (batchId) {
      students = await Student.find({ batchId });
      payloadRecords = students.map(student => ({ studentId: student._id, courseId, status, notes }));
    } else {
      const studentIds = records.map(record => record.studentId);
      students = await Student.find({ _id: { $in: studentIds } });
    }
    
    for (const student of students) {
      if (student.assignedTrainer.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error(`Not authorized to mark attendance for student ${student.studentId}`);
      }
    }
    
    const attendanceRecords = payloadRecords.map(record => ({
      studentId: record.studentId,
      batchId,
      courseId: record.courseId,
      trainerId: req.user._id,
      date: new Date(date),
      status: record.status,
      notes: record.notes || ''
    }));
    
    const createdRecords = await Attendance.insertMany(attendanceRecords);
    
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
    
    // Check if the requesting user has access to this student's attendance
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
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
    // Only allow admin or the trainer themselves to view
    if (req.user.role !== 'admin' && req.params.trainerId !== req.user._id.toString()) {
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