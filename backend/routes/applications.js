const express = require('express');
const { getApplications, updateApplicationStatus } = require('../controllers/applicationsController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

const router = express.Router();

router.route('/')
  .get(auth, getApplications);

router.route('/:id')
  .patch(auth, requireRole('employer'), updateApplicationStatus);

module.exports = router;
