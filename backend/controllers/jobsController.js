const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getJobs = async (req, res, next) => {
  try {
    const { search, type, location, experience, salaryMin, salaryMax } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (experience) query.experience = experience;
    
    if (salaryMin || salaryMax) {
      query.$and = [];
      if (salaryMin) query.$and.push({ salaryMin: { $gte: Number(salaryMin) } });
      if (salaryMax) query.$and.push({ salaryMax: { $lte: Number(salaryMax) } });
    }

    const jobs = await Job.find(query).sort({ postedAt: -1 }).populate('employerId', 'name email');
    res.json({ jobs, total: jobs.length });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const jobData = {
      ...req.body,
      employerId: req.user.id
    };
    
    const job = await Job.create(jobData);
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ job: updatedJob });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    await Application.deleteMany({ jobId: job._id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};
