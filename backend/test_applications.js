require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/precisionhire');
  const employer = await User.findOne({ email: 'rahul@test.com' });
  console.log('Employer ID:', employer._id);
  
  const jobs = await Job.find({ employerId: employer._id }).select('_id title company');
  console.log('Jobs Found:', jobs.length);
  const jobIds = jobs.map(j => j._id);
  
  const applications = await Application.find({ jobId: { $in: jobIds } });
  console.log('Applications via $in:', applications.length);
  
  let totalManualCount = 0;
  for (let job of jobs) {
    const c = await Application.countDocuments({ jobId: job._id });
    totalManualCount += c;
  }
  console.log('Total counts via countDocuments:', totalManualCount);
  
  console.log('Done!');
  process.exit(0);
}
test();
