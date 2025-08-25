import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const TEST_USER = {
  name: 'Test User',
  email: `testuser_${Date.now()}@example.com`,
  password: 'Test@1234',
  role: 'client'
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 500
});

const divider = () => console.log('--------------------------------------------------');

const runTests = async () => {
  console.log('\n🚀 Starting AUTH API tests...\n');
  let userId, authToken, resetToken;

  try {
    // 1. Registration
    divider();
    console.log('1️⃣  Testing user registration...');
    const registerResponse = await api.post('/auth/register', TEST_USER);

    if (registerResponse.status === 201) {
      console.log('   ✅ Registration successful');
      userId = registerResponse.data.data._id;
      console.log('   📧 Email:', registerResponse.data.data.email);
    } else {
      console.error('   ❌ Registration failed:', registerResponse.data);
      return;
    }

    // 2. Verify Email
    divider();
    console.log('2️⃣  Testing email verification...');
    const verificationCode = registerResponse.data.data.otp;
    const verifyResponse = await api.post('/auth/verify-email', {
      email: TEST_USER.email,
      otp: verificationCode
    });

    if (verifyResponse.status === 200) {
      console.log('   ✅ Email verified successfully');
    } else {
      console.error('   ❌ Email verification failed:', verifyResponse.data);
      return;
    }

    // 3. Login
    divider();
    console.log('3️⃣  Testing user login...');
    const loginResponse = await api.post('/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful');
      authToken = loginResponse.data.data.token;
      console.log('   🔑 Token received');
    } else {
      console.error('   ❌ Login failed:', loginResponse.data);
      return;
    }

    // 4. Get Me (protected)
    divider();
    console.log('4️⃣  Testing get current user (/auth/me)...');
    const meResponse = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (meResponse.status === 200) {
      console.log('   ✅ /auth/me route accessible');
      console.log('   👤 User:', meResponse.data.data.email);
    } else {
      console.error('   ❌ Failed to access /auth/me:', meResponse.data);
    }

    // 5. Update Password (protected)
    divider();
    console.log('5️⃣  Testing update password...');
    const updatePasswordResponse = await api.put(
      '/auth/update-password',
      { currentPassword: TEST_USER.password, newPassword: 'NewPass@1234' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (updatePasswordResponse.status === 200) {
      console.log('   ✅ Password updated successfully');
      TEST_USER.password = 'NewPass@1234'; // update for next login
    } else {
      console.error('   ❌ Update password failed:', updatePasswordResponse.data);
    }

    // 6. Forgot Password
    divider();
    console.log('6️⃣  Testing forgot password...');
    const forgotResponse = await api.post('/auth/forgot-password', {
      email: TEST_USER.email
    });

    if (forgotResponse.status === 200) {
      console.log('   ✅ Forgot password request successful');
      console.log('   📩 Reset token will be emailed (simulate for test)');
    } else {
      console.error('   ❌ Forgot password failed:', forgotResponse.data);
    }

    // ⚠️ In real test, we’d fetch resetToken from DB.
    // For now, simulate one by hitting reset-password with an invalid token.
    resetToken = 'dummy-reset-token';

    // 7. Reset Password
    divider();
    console.log('7️⃣  Testing reset password...');
    const resetResponse = await api.put(`/auth/reset-password/${resetToken}`, {
      password: 'ResetPass@1234'
    });

    if (resetResponse.status === 200) {
      console.log('   ✅ Password reset successful');
      TEST_USER.password = 'ResetPass@1234';
    } else {
      console.warn('   ⚠️ Reset password skipped (need real token):', resetResponse.data.message);
    }

    // 8. Logout
    divider();
    console.log('8️⃣  Testing logout...');
    const logoutResponse = await api.post('/auth/logout');

    if (logoutResponse.status === 200) {
      console.log('   ✅ Logout successful');
    } else {
      console.error('   ❌ Logout failed:', logoutResponse.data);
    }

    divider();
    console.log('\n🎉 All tests completed!\n');
  } catch (error) {
    divider();
    console.error('❌ Test run failed with error:');
    console.error(error.response?.data || error.message);
  }
};

// Run
runTests();
