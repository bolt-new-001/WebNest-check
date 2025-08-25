import { useState } from 'react';
import axios from 'axios';

export const AuthClientPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        // Optionally store token in localStorage / context
        localStorage.setItem('authToken', response.data.data.token);
        // Redirect to client dashboard (example)
        setTimeout(() => {
          window.location.href = '/client/dashboard';
        }, 1000);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Client Login
        </h2>

        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '0.8rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '0.8rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.8rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#2196f3',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <a href="/auth/forgot-password" style={{ color: '#2196f3', textDecoration: 'none' }}>
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};
