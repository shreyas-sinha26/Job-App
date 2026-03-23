const { validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyForJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      jobId: req.params.id,
      userId: req.user.id
    });

    if (existingApplication) {
      return res.status(409).json({ message: 'Already applied for this job' });
    }

    const application = await Application.create({
      jobId: req.params.id,
      userId: req.user.id,
      coverLetter: req.body.coverLetter,
      status: 'Pending'
    });

    res.status(201).json({ application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already applied for this job' });
    }
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    if (req.user.role === 'jobseeker') {
      const applications = await Application.find({ userId: req.user.id })
        .populate('jobId', 'title company location type')
        .sort({ appliedAt: -1 });

      const formatted = applications.map(app => ({
        id: app._id,
        jobId: app.jobId._id,
        status: app.status,
        appliedAt: app.appliedAt,
        coverLetter: app.coverLetter,
        jobTitle: app.jobId.title,
        company: app.jobId.company,
        location: app.jobId.location,
        type: app.jobId.type
      }));

      return res.json({ applications: formatted });
    } 
    
    // Employer
    if (req.user.role === 'employer') {
      // Find jobs owned by employer
      let jobQuery = { employerId: req.user.id };
      if (req.query.jobId) {
        jobQuery._id = req.query.jobId;
      }
      
      const jobs = await Job.find(jobQuery).select('_id title company');
      const jobIds = jobs.map(j => j._id);

      const applications = await Application.find({ jobId: { $in: jobIds } })
        .populate('jobId', 'title company location type')
        .populate('userId', 'name email')
        .sort({ appliedAt: -1 });

      const formatted = applications.map(app => {
        const result = {
          id: app._id,
          jobId: app.jobId ? app.jobId._id : null,
          status: app.status,
          appliedAt: app.appliedAt,
          coverLetter: app.coverLetter,
          jobTitle: app.jobId ? app.jobId.title : 'Unknown',
          company: app.jobId ? app.jobId.company : 'Unknown'
        };
        
        if (app.userId) {
           result.applicant = { id: app.userId._id, name: app.userId.name, email: app.userId.email };
        }
        
        return result;
      });

      return res.json({ applications: formatted });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Reviewed', 'Accepted', 'Rejected'].includes(status)) {
       return res.status(422).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.jobId || application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ application });
  } catch (error) {
    next(error);
  }
};
