const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: null },
  location: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'], 
    required: true 
  },
  experience: { 
    type: String, 
    enum: ['Entry', 'Mid', 'Senior', 'Lead'], 
    required: true 
  },
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  tags: [{ type: String }],
  description: { type: String, required: true },
  deadline: { type: Date },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now }
});

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Job', jobSchema);
