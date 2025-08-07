require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Course = require('./src/models/courseModel');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data (optional)
    await User.deleteMany({});
    await Course.deleteMany({});

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

    // Create sample trainer
    const trainer = await User.create({
      name: 'Trainer User',
      email: 'trainer@codehub.in',
      phone: '7777777777',
      password: 'trainer123',
      role: 'trainer'
    });

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

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();