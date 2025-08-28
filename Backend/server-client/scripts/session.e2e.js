// Simple E2E script to verify session lifecycle
// Run with: node scripts/session.e2e.js

import axios from 'axios'
import crypto from 'crypto'

const API = 'http://localhost:5001'

async function run() {
  try {
    let email = process.env.TEST_EMAIL || 'test@example.com'
    let password = process.env.TEST_PASSWORD || 'password123'

    console.log('1) Attempt login...')
    let loginRes
    try {
      loginRes = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true })
    } catch (e) {
      if (e?.response?.data?.message === 'Invalid credentials') {
        console.log('No account or wrong creds. Registering a fresh test user...')
        // Use a random email to avoid conflicts
        email = `e2e_${crypto.randomBytes(4).toString('hex')}@example.com`
        password = 'password123'
        const registerRes = await axios.post(`${API}/api/auth/register`, {
          name: 'E2E Tester',
          email,
          password,
          role: 'client'
        })
        if (!registerRes.data?.success) throw new Error('Registration failed')

        // Auto-verify using OTP from response in test env
        const otp = registerRes.data?.data?.otp
        if (otp) {
          console.log('2) Auto verifying email with OTP...')
          const verifyRes = await axios.post(`${API}/api/auth/verify-email`, { email, otp })
          if (!verifyRes.data?.success) throw new Error('OTP verification failed')
        } else {
          console.log('No OTP in response; proceeding to login (may fail if verification required).')
        }

        // Try login again after verification/registration
        loginRes = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true })
      } else {
        throw e
      }
    }

    console.log('Login response:', loginRes.data)
    if (!loginRes.data?.token) throw new Error('No token from login')
    const token = loginRes.data.token

    const client = axios.create({
      baseURL: API,
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('2) Fetch sessions...')
    const sessionsRes = await client.get('/api/auth/sessions')
    console.log('Sessions:', sessionsRes.data)

    const sessions = sessionsRes.data?.data || []
    const other = sessions.filter(s => !s.isCurrent)

    if (other[0]) {
      console.log('3) Revoke one session...')
      await client.delete(`/api/auth/sessions/${other[0].id}`)
    }

    console.log('4) Revoke others...')
    await client.delete('/api/auth/sessions')

    console.log('5) Done. ✅')
  } catch (e) {
    console.error('E2E failed:', e?.response?.data || e.message)
    process.exit(1)
  }
}

run()


