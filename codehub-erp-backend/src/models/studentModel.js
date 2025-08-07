const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    unique: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  trialStartDate: {
    type: Date
  },
  trialEndDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'inactive', 'graduated'],
    default: 'trial'
  },
  assignedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  registrationFee: {
    amount: {
      type: Number,
      default: 2000
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: {
      type: Date
    },
    refunded: {
      type: Boolean,
      default: false
    },
    refundDate: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Generate student ID before saving
studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.studentId = `STU${year}${random}`;
    
    // Check for uniqueness
    let exists;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      exists = await mongoose.models.Student.findOne({ studentId: this.studentId });
      if (exists) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique student ID');
        }
        this.studentId = `STU${year}${Math.floor(1000 + Math.random() * 9000)}`;
      }
    } while (exists && attempts < maxAttempts);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);