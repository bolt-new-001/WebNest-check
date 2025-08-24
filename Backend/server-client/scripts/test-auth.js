import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');
dotenv.config({ path: envPath });

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';

// Test user credentials
// Test user with timestamp to ensure uniqueness
const timestamp = Date.now();
const TEST_USER = {
  name: 'Test User',
  email: `testuser_${timestamp}@example.com`,
  password: 'Test@1234',
  role: 'client'
};

const INVALID_USERS = {
  missingFields: {
    name: 'Incomplete User'
  },
  invalidEmail: {
    name: 'Invalid Email',
    email: 'invalid-email',
    password: 'Test@1234'
  },
  shortPassword: {
    name: 'Short Password',
    email: `shortpass_${timestamp}@example.com`,
    password: '123'
  }
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
    // 1. Test registration with missing fields
    console.log('1. Testing registration with missing fields...');
    try {
      await api.post('/auth/register', INVALID_USERS.missingFields);
      console.error('❌ Should fail with missing required fields');
      process.exit(1);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Registration validation works for missing fields');
      } else {
        throw error;
      }
    }

    // 2. Test registration with invalid email
    console.log('\n2. Testing registration with invalid email...');
    try {
      await api.post('/auth/register', INVALID_USERS.invalidEmail);
      console.error('❌ Should fail with invalid email');
      process.exit(1);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Registration validation works for invalid email');
      } else {
        throw error;
      }
    }

    // 3. Test valid registration
    console.log('\n3. Testing valid user registration...');
    const registerResponse = await api.post('/auth/register', TEST_USER);
    
    console.log('✅ Registration successful');
    console.log(`   User ID: ${registerResponse.data.data._id}`);
    console.log(`   Email: ${registerResponse.data.data.email}`);
    
    // Store user ID for later tests
    userId = registerResponse.data.data._id;
    
    // 4. Test duplicate registration
    console.log('\n4. Testing duplicate registration...');
    try {
      await api.post('/auth/register', TEST_USER);
      console.error('❌ Duplicate registration should fail');
      process.exit(1);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Duplicate registration prevented');
      } else {
        throw error;
      }
    }
    
    // 5. Test login with unverified email
    console.log('\n5. Testing login with unverified email...');
    try {
      const response = await api.post('/auth/login', {
        email: TEST_USER.email,
        password: TEST_USER.password
      });
      console.error('❌ Login should fail with unverified email');
      console.log(response.data);
      process.exit(1);
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.needsVerification) {
        console.log('✅ Login correctly prevented for unverified email');
      } else {
        console.error('❌ Unexpected error during unverified login test');
        console.error(error.response?.data || error.message);
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

// Cleanup function
const cleanupTestData = async () => {
  try {
    const User = (await import('../models/User.js')).default;
    await User.deleteMany({ 
      $or: [
        { email: TEST_USER.email },
        { email: INVALID_USERS.invalidEmail.email },
        { email: INVALID_USERS.shortPassword.email }
      ]
    });
    console.log('✅ Cleaned up test data');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await cleanupTestData();
  process.exit(0);
});

// Run the tests
(async () => {
  try {
    await connectDB();
    await cleanupTestData(); // Clean up any existing test data
    await runTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    await cleanupTestData();
    process.exit(0);
  }
})();
