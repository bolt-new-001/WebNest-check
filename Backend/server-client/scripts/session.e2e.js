// Simple E2E script to verify session lifecycle
// Run with: node scripts/session.e2e.js

import axios from 'axios'

const API = 'http://localhost:5001'

async function run() {
  try {
    console.log('1) Logging in...')
    const loginRes = await axios.post(`${API}/api/auth/login`, {
      email: process.env.TEST_EMAIL || 'test@example.com',
      password: process.env.TEST_PASSWORD || 'password123'
    }, { withCredentials: true })

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


