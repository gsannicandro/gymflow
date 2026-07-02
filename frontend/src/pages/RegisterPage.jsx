import React, { useState } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalTypography from '../components/ui/BrutalTypography';
import AuthLayout from '../components/ui/AuthLayout';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    weight: '',
    height: '',
    email: '',
    password: '',
    confermaPassword: '',
    isCoach: false,
    inviteCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confermaPassword) {
      setError('Le password non coincidono');
      return;
    }
    
    setLoading(true);
    
    register({
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height),
      role: formData.isCoach ? 'trainer' : 'user',
      inviteCode: formData.isCoach ? formData.inviteCode : undefined
    })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Errore durante la registrazione');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout title="Registrati" stackedLogo={false} logoSize={{ xs: '3rem', md: '5rem' }}>
      {error && <BrutalAlert>{error}</BrutalAlert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <BrutalInput
            name="firstName"
            placeholder="NOME"
            fullWidth
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <BrutalInput
            name="lastName"
            placeholder="COGNOME"
            fullWidth
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </Box>
        <BrutalInput
          name="birthDate"
          type="date"
          fullWidth
          required
          value={formData.birthDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <BrutalInput
            name="weight"
            type="number"
            placeholder="PESO (KG)"
            fullWidth
            required
            value={formData.weight}
            onChange={handleChange}
          />
          <BrutalInput
            name="height"
            type="number"
            placeholder="ALTEZZA (CM)"
            fullWidth
            required
            value={formData.height}
            onChange={handleChange}
          />
        </Box>
        <BrutalInput
          name="email"
          type="email"
          placeholder="EMAIL"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <BrutalInput
            name="password"
            type="password"
            placeholder="PASSWORD"
            fullWidth
            required
            inputProps={{ minLength: 6 }}
            value={formData.password}
            onChange={handleChange}
          />
          <BrutalInput
            name="confermaPassword"
            type="password"
            placeholder="CONFERMA"
            fullWidth
            required
            inputProps={{ minLength: 6 }}
            value={formData.confermaPassword}
            onChange={handleChange}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              name="isCoach"
              checked={formData.isCoach}
              onChange={handleChange}
              sx={{
                color: 'black',
                '&.Mui-checked': { color: 'black' },
                '& .MuiSvgIcon-root': { fontSize: 32 }
              }}
            />
          }
          label={
            <BrutalTypography sx={{ fontStyle: 'italic', letterSpacing: '-0.025em' }}>
              Sono un allenatore
            </BrutalTypography>
          }
          sx={{ m: 0 }}
        />
        {formData.isCoach && (
          <BrutalInput
            name="inviteCode"
            placeholder="CODICE DI INVITO TRAINER"
            fullWidth
            required
            value={formData.inviteCode}
            onChange={handleChange}
          />
        )}
        <BrutalButton type="submit" fullWidth disabled={loading}>
          {loading ? 'Caricamento...' : 'Registrati →'}
        </BrutalButton>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Link
          to="/login"
          style={{
            fontWeight: 900,
            textTransform: 'uppercase',
            fontStyle: 'italic',
            textDecoration: 'underline',
            color: 'black'
          }}
        >
          Hai già un account? Accedi
        </Link>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
