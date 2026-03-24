const axios = require('axios');
async function test() {
  const res = await axios.post('http://localhost:3001/auth/login', { email: 'rahul@test.com', password: 'password123' });
  const token = res.data.token;
  const userId = res.data.user.id;
  const appRes = await axios.get(`http://localhost:3001/jobs?employerId=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Jobs returned:', appRes.data.jobs.length);
  if (appRes.data.jobs.length > 0) {
    console.log('Applications Count on First Job:', appRes.data.jobs[0].applicationsCount);
  }
}
test().catch(console.error);
