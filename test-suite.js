const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data, headers: res.headers });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING COMPREHENSIVE SUITE FOR DHAYALAN PORTFOLIO');
  console.log('==================================================');

  const tests = [
    { name: 'Home Page HTML', path: '/', method: 'GET', expectedStatus: 200 },
    { name: 'Projects SPA Route Direct Access', path: '/projects', method: 'GET', expectedStatus: 200 },
    { name: 'About SPA Route Direct Access', path: '/about', method: 'GET', expectedStatus: 200 },
    { name: 'Resume SPA Route Direct Access', path: '/resume', method: 'GET', expectedStatus: 200 },
    { name: 'Admin Login Route Direct Access', path: '/admin/login', method: 'GET', expectedStatus: 200 },
    { name: 'API Health Endpoint', path: '/api/health', method: 'GET', expectedStatus: 200 },
    { name: 'Profile API', path: '/api/profile', method: 'GET', expectedStatus: 200 },
    { name: 'Education API', path: '/api/education', method: 'GET', expectedStatus: 200 },
    { name: 'Skills API', path: '/api/skills', method: 'GET', expectedStatus: 200 },
    { name: 'Projects API', path: '/api/projects', method: 'GET', expectedStatus: 200 },
    { name: 'Certificates API', path: '/api/certificates', method: 'GET', expectedStatus: 200 },
    { name: 'Achievements API', path: '/api/achievements', method: 'GET', expectedStatus: 200 },
    { name: 'Internships API', path: '/api/internships', method: 'GET', expectedStatus: 200 },
    { name: 'Resume API', path: '/api/resume', method: 'GET', expectedStatus: 200 }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: t.path,
        method: t.method
      });

      if (res.statusCode === t.expectedStatus) {
        console.log(`✅ PASSED: ${t.name} (${t.path}) -> HTTP ${res.statusCode}`);
        passed++;
      } else {
        console.log(`❌ FAILED: ${t.name} (${t.path}) -> Expected HTTP ${t.expectedStatus}, got ${res.statusCode}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ERROR: ${t.name} (${t.path}) -> ${err.message}`);
      failed++;
    }
  }

  // Test Contact Submission POST
  try {
    const postData = JSON.stringify({
      name: 'Verification Bot',
      email: 'test@example.com',
      phone: '9876543210',
      message: 'Testing portfolio contact form submission.'
    });

    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    if (res.statusCode === 201) {
      console.log(`✅ PASSED: Contact Form Submission POST -> HTTP ${res.statusCode}`);
      passed++;
    } else {
      console.log(`❌ FAILED: Contact Form Submission POST -> HTTP ${res.statusCode}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ERROR: Contact Form Submission -> ${err.message}`);
    failed++;
  }

  // Test Admin Login POST
  try {
    const authData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(authData)
      }
    }, authData);

    if (res.statusCode === 200) {
      const parsed = JSON.parse(res.data);
      if (parsed.token) {
        console.log(`✅ PASSED: Admin Authentication (admin/admin123) -> HTTP ${res.statusCode} with JWT token`);
        passed++;
      } else {
        console.log(`❌ FAILED: Admin Login -> Token missing in response`);
        failed++;
      }
    } else {
      console.log(`❌ FAILED: Admin Login -> Expected HTTP 200, got ${res.statusCode}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ERROR: Admin Login -> ${err.message}`);
    failed++;
  }

  console.log('==================================================');
  console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================');
}

runTests();
