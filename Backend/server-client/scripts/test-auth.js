import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');
dotenv.config({ path: envPath });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';

// Test user credentials
const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@example.com`,
  password: 'Test@1234',
  role: 'client'
};

// Global variables to store tokens and user data
let authToken = '';
let userId = '';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status} ${error.response?.data?.message || error.message}`);
    return Promise.reject(error);
  }
);

// Test cases
const runTests = async () => {
  console.log('🚀 Starting authentication tests...\n');

  try {
    // 1. Test user registration
    console.log('1. Testing user registration...');
    const registerResponse = await api.post('/auth/register', {
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: TEST_USER.password,
      role: TEST_USER.role
    });
    
    console.log('✅ Registration successful');
    console.log(`   User ID: ${registerResponse.data.data._id}`);
    console.log(`   Email: ${registerResponse.data.data.email}\n`);
    
    // Store user ID for later tests
    userId = registerResponse.data.data._id;
    
    // 2. Test login with unverified email
    console.log('2. Testing login with unverified email...');
    try {
      await api.post('/auth/login', {
        email: TEST_USER.email,
        password: TEST_USER.password
      });
      console.error('❌ Login should fail with unverified email');
      process.exit(1);
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.needsVerification) {
        console.log('✅ Login correctly prevented for unverified email');
      } else {
        console.error('❌ Unexpected error during unverified login test');
        throw error;
      }
    }

    // 3. Test email verification
    console.log('\n3. Testing email verification...');
    // In a real test, you would extract the OTP from the email
    // For testing purposes, we'll fetch it from the database
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);
    const verificationCode = user.emailVerificationCode;
    
    const verifyResponse = await api.post('/auth/verify-email', {
      email: TEST_USER.email,
      code: verificationCode
    });
    
    console.log('✅ Email verification successful');
    console.log(`   Token: ${verifyResponse.data.token.substring(0, 20)}...\n`);
    
    // Store auth token for authenticated requests
    authToken = verifyResponse.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    // 4. Test login with verified email
    console.log('4. Testing login with verified email...');
    const loginResponse = await api.post('/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    console.log('✅ Login successful');
    console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...\n`);
    
    // 5. Test protected route
    console.log('5. Testing protected route...');
    const profileResponse = await api.get('/users/profile');
    
    console.log('✅ Protected route accessed successfully');
    console.log('   User profile:', {
      id: profileResponse.data._id,
      name: profileResponse.data.name,
      email: profileResponse.data.email,
      role: profileResponse.data.role
    });
    
    console.log('\n🎉 All authentication tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run the tests
runTests();
