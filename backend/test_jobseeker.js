require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/precisionhire');
  const jobseeker = await User.findOne({ email: 'priya@test.com' });
  console.log('Jobseeker ID:', jobseeker._id);
  
  const applications = await Application.find({ userId: jobseeker._id });
  console.log('Applications via userId:', applications.length);
  
  console.log('Done!');
  process.exit(0);
}
test();
