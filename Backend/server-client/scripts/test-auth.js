import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api'; // Update port if different

// Test user credentials
const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@example.com`,
  password: 'Test@1234',
  role: 'client'
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: (status) => status < 500 // Resolve only if status code is less than 500
});

const runTests = async () => {
  console.log('🚀 Starting API tests...\n');
  let userId, authToken;

  try {
    // 1. Test registration
    console.log('1. Testing user registration...');
    const registerResponse = await api.post('/auth/register', TEST_USER);

    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
      userId = registerResponse.data.data._id;
      console.log('   User ID:', userId);
      console.log('   Email:', registerResponse.data.data.email);
    } else {
      console.error('❌ Registration failed:', registerResponse.data);
      return;
    }

    // 2. Get verification OTP from response (test-only)
    console.log('\n2. Fetching verification OTP...');
    const verificationCode = registerResponse.data.data.otp;
    if (!verificationCode) {
      console.error('❌ OTP missing in response! Did you set NODE_ENV=test?');
      return;
    }
    console.log('   Verification code:', verificationCode);

    // 3. Verify email with the OTP
    console.log('\n3. Verifying email...');
    const verifyResponse = await api.post('/auth/verify-email', {
      email: TEST_USER.email,
      otp: verificationCode
    });

    if (verifyResponse.status === 200) {
      console.log('✅ Email verified successfully');
    } else {
      console.error('❌ Email verification failed:', verifyResponse.data);
      return;
    }

    // 4. Test login with verified email
    console.log('\n4. Testing user login...');
    const loginResponse = await api.post('/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
      authToken = loginResponse.data.data.token;
      console.log('   Token:', authToken ? 'Received' : 'Missing!');

      // 5. Test protected route
      console.log('\n5. Testing protected route...');
      const profileResponse = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (profileResponse.status === 200) {
        console.log('✅ Protected route accessible');
        console.log('   User data:', profileResponse.data);
      } else {
        console.error('❌ Failed to access protected route:', profileResponse.data);
      }
    } else {
      console.error('❌ Login failed:', loginResponse.data);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.response?.data || error.message);
  } finally {
    // ⚠️ No manual DB cleanup needed, unless you want to keep DB clean
    console.log('\n🧹 Note: Test user still exists in DB (cleanup skipped since no mongoose here).');
    console.log('   You can run a cleanup script if needed.');
  }
};

// Run the tests
runTests();
