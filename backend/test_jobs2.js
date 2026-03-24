const axios = require('axios');
async function test() {
  const res = await axios.get('http://localhost:3001/jobs?employerId=123notfound');
  console.log('Jobs returned:', res.data.jobs.length);
}
test().catch(console.error);
