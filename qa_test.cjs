// PrecisionHire QA End-to-End Test Script
const http = require('http');

const BASE = 'http://localhost:3001';
const results = [];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function report(step, name, pass, response, notes = '') {
  const status = pass ? 'PASS' : 'FAIL';
  results.push({ step, name, pass, response, notes });
  const bodyStr = JSON.stringify(response.body);
  const truncated = bodyStr.length > 250 ? bodyStr.substring(0, 250) + '...' : bodyStr;
  console.log(`STEP ${step} -- ${name}`);
  console.log(`  Status:   ${status}`);
  console.log(`  Response: ${response.status} ${truncated}`);
  if (notes) console.log(`  Notes:    ${notes}`);
  console.log('');
}

async function getOrCreateAccount(name, email, password, role) {
  // Try signup first
  let res = await request('POST', '/auth/signup', { name, email, password, role });
  if (res.status === 201 || res.status === 200) {
    return res;
  }
  // If already exists, try login
  if (res.status === 400) {
    console.log(`  ${role} signup returned 400, trying login...`);
    res = await request('POST', '/auth/login', { email, password });
    return res;
  }
  return res;
}

async function run() {
  let EMPLOYER_TOKEN, EMPLOYER_ID;
  let JOBSEEKER_TOKEN, JOBSEEKER_ID;
  let JOB_ID, APPLICATION_ID;
  let OTHER_EMPLOYER_TOKEN, OTHER_EMPLOYER_ID;

  console.log('=== TASK -- SET UP REAL USER ACCOUNTS ===');
  console.log('');

  // --- Employer Account ---
  {
    const res = await getOrCreateAccount('Vivek Boora', 'vivekboora.ad23@bmsce.ac.in', 'yourpassword', 'employer');
    if (res.body && res.body.token) {
      EMPLOYER_TOKEN = res.body.token;
      EMPLOYER_ID = res.body.user && (res.body.user.id || res.body.user._id);
      report('ACCT1', 'Employer Account', true, res, 'EMPLOYER_ID=' + EMPLOYER_ID);
    } else {
      report('ACCT1', 'Employer Account', false, res, 'Could not get employer token');
    }
  }

  // --- Jobseeker Account ---
  {
    const res = await getOrCreateAccount('Vivek Jobseeker', 'vivekboora.ad23+jobseeker@bmsce.ac.in', 'yourpassword', 'jobseeker');
    if (res.body && res.body.token) {
      JOBSEEKER_TOKEN = res.body.token;
      JOBSEEKER_ID = res.body.user && (res.body.user.id || res.body.user._id);
      report('ACCT2', 'Jobseeker Account', true, res, 'JOBSEEKER_ID=' + JOBSEEKER_ID);
    } else {
      report('ACCT2', 'Jobseeker Account', false, res, 'Could not get jobseeker token');
    }
  }

  if (!EMPLOYER_TOKEN || !JOBSEEKER_TOKEN) {
    console.log('FATAL: Could not obtain tokens. Aborting.');
    printSummary(EMPLOYER_ID, JOBSEEKER_ID, JOB_ID, APPLICATION_ID, OTHER_EMPLOYER_ID);
    return;
  }

  console.log('=== TASK -- EMPLOYER FLOW ===');
  console.log('');

  // STEP E1 -- Create a Job Posting
  {
    const res = await request('POST', '/jobs', {
      title: 'Full Stack Developer',
      company: "Vivek's Startup",
      location: 'Bangalore',
      type: 'Full-time',
      experience: 'Mid',
      salaryMin: 1200000,
      salaryMax: 1800000,
      currency: 'INR',
      tags: ['React', 'Node.js', 'MongoDB'],
      description: 'We are looking for a passionate Full Stack Developer to join our growing team. You will work on exciting projects using modern web technologies. Requirements: 2+ years experience with React and Node.js, strong understanding of REST APIs, experience with MongoDB preferred.',
      deadline: '2026-12-31T00:00:00.000Z',
    }, EMPLOYER_TOKEN);

    const job = res.body.job || res.body;
    JOB_ID = job && (job.id || job._id);
    const pass = res.status === 201 && !!JOB_ID;
    report('E1', 'Create Job Posting', pass, res, 'JOB_ID=' + JOB_ID);
  }

  if (!JOB_ID) {
    console.log('FATAL: Could not create job. Aborting.');
    printSummary(EMPLOYER_ID, JOBSEEKER_ID, JOB_ID, APPLICATION_ID, OTHER_EMPLOYER_ID);
    return;
  }

  // STEP E2 -- Verify job appears in jobs list
  {
    const res = await request('GET', '/jobs');
    const jobs = res.body.jobs || res.body;
    const found = Array.isArray(jobs) && jobs.some(function(j) { return (j.id || j._id) === JOB_ID; });
    report('E2', 'Verify job in listing', found && res.status === 200, res, found ? 'Job found in listing' : 'Job NOT found');
  }

  // STEP E3 -- Verify employer owns the job
  {
    const res = await request('GET', '/jobs/' + JOB_ID);
    const job = res.body.job || res.body;
    const eid = job && (job.employerId || job.employer || job.postedBy);
    let match = false;
    if (typeof eid === 'string') match = eid === EMPLOYER_ID;
    else if (typeof eid === 'object' && eid) match = (eid._id === EMPLOYER_ID || eid.id === EMPLOYER_ID);
    report('E3', 'Verify employer owns job', res.status === 200 && match, res, 'employerId=' + JSON.stringify(eid) + ', expected=' + EMPLOYER_ID);
  }

  console.log('=== TASK -- JOBSEEKER FLOW ===');
  console.log('');

  // STEP J1 -- Browse jobs
  {
    const res = await request('GET', '/jobs?search=Full+Stack');
    const jobs = res.body.jobs || res.body;
    const found = Array.isArray(jobs) && jobs.some(function(j) { return (j.id || j._id) === JOB_ID; });
    report('J1', 'Browse jobs (search)', found && res.status === 200, res, found ? 'Job found' : 'Job NOT found');
  }

  // STEP J2 -- View job detail
  {
    const res = await request('GET', '/jobs/' + JOB_ID);
    report('J2', 'View job detail', res.status === 200, res);
  }

  // STEP J3 -- Apply to the job
  {
    const res = await request('POST', '/jobs/' + JOB_ID + '/apply', {
      coverLetter: "I am very excited to apply for the Full Stack Developer position at Vivek's Startup. I have 3 years of experience with React and Node.js and have built several production-grade applications. I am passionate about clean code and great user experiences. I would love to bring my skills to your growing team.",
    }, JOBSEEKER_TOKEN);

    const app = res.body.application || res.body;
    APPLICATION_ID = app && (app.id || app._id);
    const pass = (res.status === 201 || res.status === 200) && !!APPLICATION_ID;
    report('J3', 'Apply to job', pass, res, 'APPLICATION_ID=' + APPLICATION_ID);
  }

  if (!APPLICATION_ID) {
    console.log('FATAL: Could not apply to job. Aborting remaining tests.');
    printSummary(EMPLOYER_ID, JOBSEEKER_ID, JOB_ID, APPLICATION_ID, OTHER_EMPLOYER_ID);
    return;
  }

  // STEP J4 -- Verify duplicate prevention
  {
    const res = await request('POST', '/jobs/' + JOB_ID + '/apply', {
      coverLetter: "I am very excited to apply for the Full Stack Developer position at Vivek's Startup. I have 3 years of experience with React and Node.js and have built several production-grade applications. I am passionate about clean code and great user experiences. I would love to bring my skills to your growing team.",
    }, JOBSEEKER_TOKEN);

    const pass = res.status === 409 || res.status === 400;
    report('J4', 'Duplicate application prevention', pass, res, 'Expected 409, got ' + res.status);
  }

  // STEP J5 -- Check applications list
  {
    const res = await request('GET', '/applications', null, JOBSEEKER_TOKEN);
    const apps = res.body.applications || res.body;
    let found = false;
    let appObj = null;
    if (Array.isArray(apps)) {
      appObj = apps.find(function(a) { return (a.id || a._id) === APPLICATION_ID; });
      found = !!appObj;
    }
    report('J5', 'Jobseeker applications list', res.status === 200 && found, res,
      found ? 'Found, status=' + (appObj && appObj.status) : 'NOT found');
  }

  console.log('=== TASK -- EMPLOYER REVIEW FLOW ===');
  console.log('');

  // STEP R1 -- View applications for my jobs
  {
    const res = await request('GET', '/applications', null, EMPLOYER_TOKEN);
    const apps = res.body.applications || res.body;
    let found = false;
    if (Array.isArray(apps)) {
      found = apps.some(function(a) { return (a.id || a._id) === APPLICATION_ID; });
    }
    report('R1', 'Employer view applications', res.status === 200 && found, res, found ? 'Found' : 'NOT found');
  }

  // STEP R2 -- Filter by specific job
  {
    const res = await request('GET', '/applications?jobId=' + JOB_ID, null, EMPLOYER_TOKEN);
    const apps = res.body.applications || res.body;
    let found = false;
    if (Array.isArray(apps)) {
      found = apps.some(function(a) { return (a.id || a._id) === APPLICATION_ID; });
    }
    report('R2', 'Filter applications by job', res.status === 200 && found, res, found ? 'Filtered OK' : 'NOT found');
  }

  // STEP R3 -- Update status to Reviewed
  {
    const res = await request('PATCH', '/applications/' + APPLICATION_ID, { status: 'Reviewed' }, EMPLOYER_TOKEN);
    const app = res.body.application || res.body;
    const pass = res.status === 200 && app && app.status === 'Reviewed';
    report('R3', 'Update status to Reviewed', pass, res);
  }

  // STEP R4 -- Update status to Accepted
  {
    const res = await request('PATCH', '/applications/' + APPLICATION_ID, { status: 'Accepted' }, EMPLOYER_TOKEN);
    const app = res.body.application || res.body;
    const pass = res.status === 200 && app && app.status === 'Accepted';
    report('R4', 'Update status to Accepted', pass, res);
  }

  // STEP R5 -- Verify jobseeker sees updated status
  {
    const res = await request('GET', '/applications', null, JOBSEEKER_TOKEN);
    const apps = res.body.applications || res.body;
    let appObj = null;
    if (Array.isArray(apps)) {
      appObj = apps.find(function(a) { return (a.id || a._id) === APPLICATION_ID; });
    }
    const pass = res.status === 200 && appObj && appObj.status === 'Accepted';
    report('R5', 'Jobseeker sees Accepted status', pass, res, 'status=' + (appObj && appObj.status));
  }

  console.log('=== TASK -- SECURITY CHECKS ===');
  console.log('');

  // STEP S1 -- Jobseeker cannot create jobs
  {
    const res = await request('POST', '/jobs', {
      title: 'Unauthorized Job',
      company: 'Hacker Inc',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid',
      salaryMin: 100000,
      salaryMax: 200000,
      currency: 'INR',
      tags: ['test'],
      description: 'This should not be allowed. This is a test to check role-based access control for the jobseeker role attempting to create a job posting.',
      deadline: '2026-12-31T00:00:00.000Z',
    }, JOBSEEKER_TOKEN);
    report('S1', 'Jobseeker cannot create jobs', res.status === 403, res, 'Expected 403, got ' + res.status);
  }

  // STEP S2 -- Employer cannot apply to jobs
  {
    const res = await request('POST', '/jobs/' + JOB_ID + '/apply', {
      coverLetter: 'This test cover letter is long enough to pass validation. Employer should not be able to apply to their own or any job posting.',
    }, EMPLOYER_TOKEN);
    report('S2', 'Employer cannot apply to jobs', res.status === 403, res, 'Expected 403, got ' + res.status);
  }

  // STEP S3 -- Cannot update another employers application
  {
    const signupRes = await getOrCreateAccount('Other Employer', 'other@test.com', 'password123', 'employer');
    OTHER_EMPLOYER_TOKEN = signupRes.body && signupRes.body.token;
    OTHER_EMPLOYER_ID = signupRes.body && signupRes.body.user && (signupRes.body.user.id || signupRes.body.user._id);
    console.log('  Other Employer: token=' + (OTHER_EMPLOYER_TOKEN ? 'obtained' : 'MISSING') + ', id=' + OTHER_EMPLOYER_ID);

    if (OTHER_EMPLOYER_TOKEN) {
      const res = await request('PATCH', '/applications/' + APPLICATION_ID, { status: 'Rejected' }, OTHER_EMPLOYER_TOKEN);
      report('S3', 'Other employer cannot update application', res.status === 403, res, 'Expected 403, got ' + res.status);
    } else {
      report('S3', 'Other employer cannot update application', false, { status: 0, body: 'Could not create other employer' }, 'SKIP');
    }
  }

  // STEP S4 -- Cannot access private routes without token
  {
    const res = await request('GET', '/applications');
    report('S4', 'No token = 401', res.status === 401, res, 'Expected 401, got ' + res.status);
  }

  // STEP S5 -- Employer only sees their own jobs applications
  if (OTHER_EMPLOYER_TOKEN) {
    // Post a job as OTHER employer
    const otherJobRes = await request('POST', '/jobs', {
      title: 'Other Employer Job',
      company: 'Other Corp',
      location: 'Delhi',
      type: 'Full-time',
      experience: 'Junior',
      salaryMin: 500000,
      salaryMax: 900000,
      currency: 'INR',
      tags: ['Python'],
      description: 'This job was created by a different employer to test isolation. It should only be visible to the employer who created it.',
      deadline: '2026-12-31T00:00:00.000Z',
    }, OTHER_EMPLOYER_TOKEN);

    const otherJob = otherJobRes.body.job || otherJobRes.body;
    const otherJobId = otherJob && (otherJob.id || otherJob._id);
    console.log('  Other job created: ' + otherJobId);

    // As EMPLOYER_TOKEN, get applications -- should NOT see other employers jobs apps
    const res = await request('GET', '/applications', null, EMPLOYER_TOKEN);
    const apps = res.body.applications || res.body;
    let seesOther = false;
    if (Array.isArray(apps)) {
      seesOther = apps.some(function(a) {
        const jobId = a.jobId || a.job;
        const jid = typeof jobId === 'object' ? (jobId && (jobId.id || jobId._id)) : jobId;
        return jid !== JOB_ID;
      });
    }
    report('S5', 'Employer only sees own jobs apps', res.status === 200 && !seesOther, res,
      seesOther ? 'Sees apps for jobs they dont own!' : 'Correctly isolated');
  } else {
    report('S5', 'Employer only sees own jobs apps', false, { status: 0, body: 'no other employer' }, 'SKIP');
  }

  console.log('=== TASK -- CLEANUP ===');
  console.log('');

  // Delete the job
  {
    const res = await request('DELETE', '/jobs/' + JOB_ID, null, EMPLOYER_TOKEN);
    report('C1', 'Delete job', res.status === 200, res);
  }

  // Verify cascade delete
  {
    const res = await request('GET', '/applications', null, JOBSEEKER_TOKEN);
    const apps = res.body.applications || res.body;
    let found = false;
    if (Array.isArray(apps)) {
      found = apps.some(function(a) { return (a.id || a._id) === APPLICATION_ID; });
    }
    report('C2', 'Cascade delete applications', res.status === 200 && !found, res, found ? 'Application still exists!' : 'Application removed');
  }

  printSummary(EMPLOYER_ID, JOBSEEKER_ID, JOB_ID, APPLICATION_ID, OTHER_EMPLOYER_ID);
}

function printSummary(EMPLOYER_ID, JOBSEEKER_ID, JOB_ID, APPLICATION_ID, OTHER_EMPLOYER_ID) {
  console.log('');
  console.log('=== SUMMARY ===');
  const passed = results.filter(function(r) { return r.pass; }).length;
  const failed = results.filter(function(r) { return !r.pass; }).length;
  console.log('Total Steps:  ' + results.length);
  console.log('Passed:       ' + passed);
  console.log('Failed:       ' + failed);
  console.log('');
  console.log('IDs Generated:');
  console.log('  EMPLOYER_ID:       ' + EMPLOYER_ID);
  console.log('  JOBSEEKER_ID:      ' + JOBSEEKER_ID);
  console.log('  JOB_ID:            ' + JOB_ID);
  console.log('  APPLICATION_ID:    ' + APPLICATION_ID);
  console.log('  OTHER_EMPLOYER_ID: ' + OTHER_EMPLOYER_ID);
  console.log('');
  if (failed === 0) {
    console.log('Final Status: App is working correctly with real user accounts PASS');
  } else {
    console.log('Final Status: Bugs found FAIL');
    console.log('Failed steps:');
    results.filter(function(r) { return !r.pass; }).forEach(function(r) {
      console.log('  - ' + r.step + ': ' + r.name + ' (' + r.response.status + ') ' + r.notes);
    });
  }
}

run().catch(function(err) {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
