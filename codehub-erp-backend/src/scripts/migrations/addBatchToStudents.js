require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../../models/studentModel');
const Batch = require('../../models/batchModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const defaultBatchName = 'General-09AM';
    let defaultBatch = await Batch.findOne({ name: defaultBatchName });
    if (!defaultBatch) {
      defaultBatch = await Batch.create({ name: defaultBatchName, slot: '09:00-10:00' });
      console.log('Created default batch');
    }

    const result = await Student.updateMany(
      { $or: [{ batchId: { $exists: false } }, { batchId: null }] },
      { $set: { batchId: defaultBatch._id } }
    );

    console.log(`Updated ${result.modifiedCount || result.nModified} students with default batch`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();

