const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true, minlength: 100, maxlength: 1000 },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

applicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Application', applicationSchema);
