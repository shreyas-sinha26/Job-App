const express = require('express');
const { body } = require('express-validator');
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobsController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

const router = express.Router();

const jobValidation = [
  body('title', 'Title must be at least 5 characters').notEmpty().isLength({ min: 5 }),
  body('company', 'Company is required').notEmpty(),
  body('location', 'Location is required').notEmpty(),
  body('type', 'Invalid job type').isIn(['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']),
  body('experience', 'Invalid experience level').isIn(['Entry', 'Mid', 'Senior', 'Lead']),
  body('salaryMin', 'Minimum salary must be a number').isNumeric().toInt(),
  body('salaryMax', 'Maximum salary must be a number').isNumeric().toInt(),
  body('description', 'Description must be at least 100 characters').isLength({ min: 100 }),
  body('tags', 'Tags must be an array and not empty').isArray({ min: 1 })
];

const { applyForJob } = require('../controllers/applicationsController');

router.route('/')
  .get(getJobs)
  .post(auth, requireRole('employer'), jobValidation, createJob);

router.post('/:id/apply', auth, requireRole('jobseeker'), [
  body('coverLetter', 'Cover letter must be between 100 and 1000 characters').isLength({ min: 100, max: 1000 })
], applyForJob);

router.route('/:id')
  .get(getJobById)
  .put(auth, requireRole('employer'), updateJob)
  .delete(auth, requireRole('employer'), deleteJob);

module.exports = router;
