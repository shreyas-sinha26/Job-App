require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear all data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    // Create Test Users
    const jobseeker = await User.create({
      name: "Priya Sharma",
      email: "priya@test.com",
      password: "password123",
      role: "jobseeker"
    });

    const employer = await User.create({
      name: "Rahul Mehta",
      email: "rahul@test.com",
      password: "password123",
      role: "employer"
    });

    // Seed Jobs
    const companies = [
      'Razorpay', 'CRED', 'Zepto', 'Swiggy', 'Meesho', 'Groww',
      'PhonePe', 'Freshworks', 'Postman', 'BrowserStack',
      'Urban Company', 'Sarvam AI'
    ];

    const jobs = companies.map((company, index) => ({
      title: `Software Engineer ${index + 1}`,
      company: company,
      location: 'Bangalore',
      type: 'Full-time',
      experience: 'Mid',
      salaryMin: 500000 + (index * 100000),
      salaryMax: 1000000 + (index * 100000),
      currency: 'INR',
      tags: ['React', 'Node.js', 'MongoDB'],
      description: `We are looking for a highly skilled Software Engineer to join our team at ${company}. The ideal candidate will have strong experience in full-stack development. You will be responsible for building highly scalable applications.\n\nRequired Skills: React, Node.js, and MongoDB.\n\nJoin us to build the future of tech!`,
      employerId: employer._id
    }));

    await Job.insertMany(jobs);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
