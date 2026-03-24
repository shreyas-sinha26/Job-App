const axios = require('axios');
async function test() {
  const res = await axios.post('http://localhost:3001/auth/login', { email: 'rahul@test.com', password: 'password123' });
  const token = res.data.token;
  console.log('Got token');
  const appRes = await axios.get('http://localhost:3001/applications', { headers: { Authorization: `Bearer ${token}` } });
  console.log('Applications length via API:', appRes.data.applications.length);
}
test().catch(console.error);
