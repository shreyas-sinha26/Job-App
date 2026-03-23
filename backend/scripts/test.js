require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const connectDB = require('../config/db');

connectDB().then(async () => {
    const employer = await User.findOne({ email: 'rahul@test.com' });
    console.log('Employer ID:', employer._id);
    let jobQuery = { employerId: employer._id };
    const jobs = await Job.find(jobQuery).select('_id title company');
    const jobIds = jobs.map(j => j._id);
    console.log('Job IDs:', jobIds);
    const applications = await Application.find({ jobId: { $in: jobIds } }).populate('jobId').populate('userId');
    console.log('Applications:', applications.length);
    console.log(JSON.stringify(applications[0], null, 2));
    process.exit();
});
