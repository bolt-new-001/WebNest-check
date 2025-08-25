import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'dev' | 'client' | ''>('');

  const handleSelect = (type: 'dev' | 'client') => {
    setSelectedType(type);
    navigate(`/auth?type=${type}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '1rem', color: '#333' }}>
        Are you a developer or a client?
      </h1>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => handleSelect('dev')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: selectedType === 'dev' ? '2px solid #4caf50' : '1px solid #ccc',
            backgroundColor: selectedType === 'dev' ? '#e8f5e9' : '#fff',
            cursor: 'pointer'
          }}
        >
          Developer
        </button>

        <button
          onClick={() => handleSelect('client')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: selectedType === 'client' ? '2px solid #2196f3' : '1px solid #ccc',
            backgroundColor: selectedType === 'client' ? '#e3f2fd' : '#fff',
            cursor: 'pointer'
          }}
        >
          Client
        </button>
      </div>
    </div>
  );
};
