import { http, HttpResponse, delay } from 'msw';
import { jobs, applications, seedUsers } from './data';

// Helper to generate unique IDs
const uid = () => Math.random().toString(36).slice(2, 12);

export const handlers = [
  // ═══════════════════════════════════════════════════════════════
  //   AUTH
  // ═══════════════════════════════════════════════════════════════

  http.post('/api/auth/signup', async ({ request }) => {
    await delay(400);
    const body = await request.json();
    const { name, email, password, role } = body;

    // Check if user already exists
    const existing = seedUsers.find((u) => u.email === email);
    if (existing) {
      return HttpResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const user = { id: uid(), name, email, role: role || 'jobseeker' };
    seedUsers.push({ ...user, password });

    return HttpResponse.json({
      user,
      token: `mock-jwt-token-${user.id}`,
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(400);
    const body = await request.json();
    const { email, password } = body;

    const user = seedUsers.find((u) => u.email === email && u.password === password);
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = user;
    return HttpResponse.json({
      user: safeUser,
      token: `mock-jwt-token-${user.id}`,
    });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   JOBS — LIST (with filters)
  // ═══════════════════════════════════════════════════════════════

  http.get('/api/jobs', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const type = url.searchParams.get('type') || '';
    const location = url.searchParams.get('location') || '';
    const experience = url.searchParams.get('experience') || '';

    let filtered = [...jobs];

    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.company.toLowerCase().includes(search) ||
          j.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (type) {
      filtered = filtered.filter((j) => j.type === type);
    }

    if (location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (experience) {
      filtered = filtered.filter((j) => j.experience === experience);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    return HttpResponse.json({ jobs: filtered, total: filtered.length });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   JOBS — SINGLE
  // ═══════════════════════════════════════════════════════════════

  http.get('/api/jobs/:id', async ({ params }) => {
    await delay(200);
    const job = jobs.find((j) => j.id === params.id);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found.' }, { status: 404 });
    }
    return HttpResponse.json({ job });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   JOBS — CREATE (employer)
  // ═══════════════════════════════════════════════════════════════

  http.post('/api/jobs', async ({ request }) => {
    await delay(400);
    const body = await request.json();

    const newJob = {
      id: `job-${uid()}`,
      title: body.title,
      company: body.company,
      companyLogo: null,
      location: body.location,
      type: body.type,
      experience: body.experience,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      currency: body.currency || 'INR',
      tags: body.tags || [],
      description: body.description,
      postedAt: new Date().toISOString(),
      employerId: body.employerId || 'emp-mock',
      deadline: body.deadline || null,
    };

    jobs.unshift(newJob);
    return HttpResponse.json({ job: newJob }, { status: 201 });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   JOBS — UPDATE (employer)
  // ═══════════════════════════════════════════════════════════════

  http.put('/api/jobs/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json();
    const index = jobs.findIndex((j) => j.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Job not found.' }, { status: 404 });
    }

    jobs[index] = { ...jobs[index], ...body };
    return HttpResponse.json({ job: jobs[index] });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   JOBS — DELETE (employer)
  // ═══════════════════════════════════════════════════════════════

  http.delete('/api/jobs/:id', async ({ params }) => {
    await delay(300);
    const index = jobs.findIndex((j) => j.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Job not found.' }, { status: 404 });
    }

    jobs.splice(index, 1);
    return HttpResponse.json({ message: 'Job deleted successfully' });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   APPLICATIONS — APPLY
  // ═══════════════════════════════════════════════════════════════

  http.post('/api/jobs/:id/apply', async ({ params, request }) => {
    await delay(400);
    const body = await request.json();

    const job = jobs.find((j) => j.id === params.id);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found.' }, { status: 404 });
    }

    // Check if already applied (by userId from token - mock extraction)
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    const alreadyApplied = applications.find(
      (a) => a.jobId === params.id && a.userId === userId
    );
    if (alreadyApplied) {
      return HttpResponse.json(
        { message: 'You have already applied to this job.' },
        { status: 409 }
      );
    }

    const application = {
      id: `app-${uid()}`,
      jobId: params.id,
      jobTitle: job.title,
      company: job.company,
      userId,
      coverLetter: body.coverLetter,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };

    applications.push(application);
    return HttpResponse.json({ application }, { status: 201 });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   APPLICATIONS — JOBSEEKER LIST
  // ═══════════════════════════════════════════════════════════════

  http.get('/api/applications', async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    const user = seedUsers.find((u) => u.id === userId);

    if (user && user.role === 'employer') {
      const allApps = applications
        .map((a) => {
          const job = jobs.find((j) => j.id === a.jobId);
          return {
            ...a,
            jobTitle: job?.title || 'Unknown',
            company: job?.company || 'Unknown',
          };
        })
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      return HttpResponse.json({ applications: allApps, total: allApps.length });
    }

    const userApps = applications
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    return HttpResponse.json({ applications: userApps, total: userApps.length });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   APPLICATIONS — EMPLOYER VIEW (all apps for their jobs)
  // ═══════════════════════════════════════════════════════════════

  http.get('/api/employer/applications', async ({ request }) => {
    await delay(300);
    // In a real app, we'd filter by employerId. For mock, return all.
    const allApps = applications
      .map((a) => {
        const job = jobs.find((j) => j.id === a.jobId);
        return {
          ...a,
          jobTitle: job?.title || 'Unknown',
          company: job?.company || 'Unknown',
        };
      })
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    return HttpResponse.json({ applications: allApps, total: allApps.length });
  }),

  // ═══════════════════════════════════════════════════════════════
  //   APPLICATIONS — UPDATE STATUS (employer)
  // ═══════════════════════════════════════════════════════════════

  http.patch('/api/applications/:id/status', async ({ params, request }) => {
    await delay(300);
    const body = await request.json();
    const index = applications.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Application not found.' }, { status: 404 });
    }

    applications[index] = { ...applications[index], status: body.status };
    return HttpResponse.json({ application: applications[index] });
  }),
];
