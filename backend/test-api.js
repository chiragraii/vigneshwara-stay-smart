// Simple API test script
// Run with: node test-api.js

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Hotel Vigneshwara Lodge API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData.status);
    console.log('');

    // Test 2: Signup
    console.log('2️⃣ Testing signup...');
    const signupData = {
      full_name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '+1234567890',
      password: 'Test123',
    };

    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });

    const signupResult = await signupRes.json();
    if (signupResult.success) {
      console.log('✅ Signup successful');
      console.log('   User:', signupResult.data.user.email);
      console.log('   Token:', signupResult.data.token.substring(0, 20) + '...');
      console.log('');

      const token = signupResult.data.token;

      // Test 3: Login
      console.log('3️⃣ Testing login...');
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const loginResult = await loginRes.json();
      if (loginResult.success) {
        console.log('✅ Login successful');
        console.log('   User:', loginResult.data.user.full_name);
        console.log('');

        // Test 4: Protected Route
        console.log('4️⃣ Testing protected route (get profile)...');
        const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileResult = await profileRes.json();
        if (profileResult.success) {
          console.log('✅ Profile retrieved successfully');
          console.log('   Name:', profileResult.data.user.full_name);
          console.log('   Email:', profileResult.data.user.email);
          console.log('   Phone:', profileResult.data.user.phone);
          console.log('');

          // All tests passed
          console.log('🎉 All tests passed! Your API is working correctly.');
        } else {
          console.log('❌ Profile test failed:', profileResult.error);
        }
      } else {
        console.log('❌ Login failed:', loginResult.error);
      }
    } else {
      console.log('❌ Signup failed:', signupResult.error || signupResult.errors);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n⚠️  Make sure the backend server is running on http://localhost:5000');
    console.log('   Start it with: npm run dev');
  }
}

testAPI();
