import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalTypography from '../components/ui/BrutalTypography';
import AuthLayout from '../components/ui/AuthLayout';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    login(formData)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Errore durante il login');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout title="Login" stackedLogo={true}>
      {error && <BrutalAlert>{error}</BrutalAlert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <BrutalInput
          name="email"
          type="email"
          placeholder="EMAIL"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />

        <BrutalInput
          name="password"
          type="password"
          placeholder="••••••••"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
        />

        <BrutalButton type="submit" fullWidth disabled={loading}>
          {loading ? 'Caricamento...' : 'Log-In →'}
        </BrutalButton>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Link
          to="/register"
          style={{
            fontWeight: 900,
            textTransform: 'uppercase',
            fontStyle: 'italic',
            textDecoration: 'underline',
            color: 'black'
          }}
        >
          Non hai un account? Registrati
        </Link>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
