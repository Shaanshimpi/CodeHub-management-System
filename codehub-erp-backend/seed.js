require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Course = require('./src/models/courseModel');
const Batch = require('./src/models/batchModel');
const Student = require('./src/models/studentModel');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data (optional)
    await User.deleteMany({});
    await Course.deleteMany({});
    await Batch.deleteMany({});
    await Student.deleteMany({});

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@codehub.in',
      phone: '9999999999',
      password: 'admin123',
      role: 'super_admin'
    });

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@codehub.in',
      phone: '8888888888',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample trainers
    const trainers = await User.create([
        {
            name: 'Trainer User 1',
            email: 'trainer1@codehub.in',
            phone: '7777777771',
            password: 'trainer123',
            role: 'trainer'
        },
        {
            name: 'Trainer User 2',
            email: 'trainer2@codehub.in',
            phone: '7777777772',
            password: 'trainer123',
            role: 'trainer'
        },
        {
            name: 'Trainer User 3',
            email: 'trainer3@codehub.in',
            phone: '7777777773',
            password: 'trainer123',
            role: 'trainer'
        }
    ]);

    // Create sample sales person
    const salesPerson = await User.create({
      name: 'Sales Person',
      email: 'sales@codehub.in',
      phone: '6666666666',
      password: 'sales123',
      role: 'sales_person'
    });

    // Create sample courses
    const courses = await Course.create([
      {
        name: 'Full Stack Development',
        description: 'Learn full stack development with MERN stack',
        duration: 24, // weeks
        totalFees: 50000,
        installments: [
          { amount: 10000, dueWeek: 1 },
          { amount: 10000, dueWeek: 8 },
          { amount: 10000, dueWeek: 16 },
          { amount: 20000, dueWeek: 24 }
        ]
      },
      {
        name: 'Data Science',
        description: 'Learn data science with Python',
        duration: 20,
        totalFees: 45000,
        installments: [
          { amount: 10000, dueWeek: 1 },
          { amount: 10000, dueWeek: 8 },
          { amount: 10000, dueWeek: 16 },
          { amount: 15000, dueWeek: 20 }
        ]
      }
    ]);

    // Create batches
    const batches = await Batch.create([
      { name: 'FS-05PM', slot: '17:00-18:00', courseId: courses[0]._id, trainerId: trainers[0]._id },
      { name: 'FS-07PM', slot: '19:00-20:00', courseId: courses[0]._id, trainerId: trainers[1]._id },
      { name: 'FS-06PM', slot: '18:00-19:00', courseId: courses[0]._id, trainerId: trainers[2]._id },
      { name: 'FS-07AM', slot: '07:00-08:00', courseId: courses[0]._id, trainerId: trainers[0]._id },
      { name: 'FS-08AM', slot: '08:00-09:00', courseId: courses[0]._id, trainerId: trainers[1]._id },
      { name: 'FS-09AM', slot: '09:00-10:00', courseId: courses[0]._id, trainerId: trainers[2]._id }
    ]);

    // Create sample students
    const studentUsers = [];
    for (let i = 1; i <= 30; i++) {
        studentUsers.push({
            name: `Student ${i}`,
            email: `student${i}@codehub.in`,
            phone: `90000000${i.toString().padStart(2, '0')}`,
            password: 'student123',
            role: 'student',
            salesPerson: salesPerson._id
        });
    }
    const createdStudentUsers = await User.create(studentUsers);

    const students = [];
    for (let i = 0; i < 30; i++) {
        students.push({
            userId: createdStudentUsers[i]._id,
            salesPerson: salesPerson._id,
            assignedCourses: [courses[0]._id],
            assignedTrainer: trainers[i % 3]._id, // Distribute students among 3 trainers
            batchId: batches[i % 6]._id, // Distribute students among 6 batches
            status: 'active'
        });
    }
    await Student.create(students);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();