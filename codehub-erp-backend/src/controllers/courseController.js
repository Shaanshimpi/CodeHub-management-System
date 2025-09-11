const Course = require('../models/courseModel');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true });
    console.log('[courseController.getCourses] found:', courses.length)
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses (admin)
// @route   GET /api/courses/all
// @access  Private/Admin
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  try {
    const { name, description, duration, totalFees, installments } = req.body;
    
    const course = await Course.create({
      name,
      description,
      duration,
      totalFees,
      installments,
      isActive: true
    });
    
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    course.name = req.body.name || course.name;
    course.description = req.body.description || course.description;
    course.duration = req.body.duration || course.duration;
    course.totalFees = req.body.totalFees || course.totalFees;
    course.installments = req.body.installments || course.installments;
    course.isActive = req.body.isActive !== undefined ? req.body.isActive : course.isActive;
    
    const updatedCourse = await course.save();
    
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if any students are assigned to this course
    const students = await Student.find({ assignedCourses: course._id });
    if (students.length > 0) {
      res.status(400);
      throw new Error('Cannot delete course with assigned students');
    }
    
    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};