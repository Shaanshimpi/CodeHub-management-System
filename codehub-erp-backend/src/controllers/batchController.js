const Batch = require('../models/batchModel');
const Student = require('../models/studentModel');

const getBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find()
      .populate('courseId', 'name')
      .populate('trainerId', 'name');
    res.json(batches);
  } catch (error) {
    next(error);
  }
};

const createBatch = async (req, res, next) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
};

const updateBatch = async (req, res, next) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404);
      throw new Error('Batch not found');
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const getBatchStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ batchId: req.params.id })
      .populate('userId', 'name email')
      .populate('assignedCourses', 'name')
      .populate('assignedTrainer', 'name');
    res.json(students);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBatches,
  createBatch,
  updateBatch,
  getBatchStudents
};

