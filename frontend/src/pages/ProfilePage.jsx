import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import CancelIcon from '@mui/icons-material/Cancel';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalTypography from '../components/ui/BrutalTypography';
import BrutalCard from '../components/ui/BrutalCard';
import UserAvatar from '../components/UserAvatar';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    weight: '',
    height: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        weight: user.weight || '',
        height: user.height || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    authApi.updateProfile({
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height)
    })
      .then(response => {
        updateUser(response.data.user);
        setSuccess('Profilo aggiornato con successo!');
        setIsEditing(false);
        
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(err => {
        console.error('Error updating profile:', err);
        setError(err.response?.data?.message || 'Errore durante l\'aggiornamento del profilo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Le nuove password non combaciano!');
      return;
    }

    setLoading(true);
    
    authApi.changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    })
      .then(() => {
        setSuccess('Password modificata con successo!');
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(err => {
        console.error('Error changing password:', err);
        setError(err.response?.data?.message || 'Errore durante il cambio della password');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!user) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '8px solid black', gap: 3 }}>
        <UserAvatar user={user} size={80} borderWeight={4} iconFontSize="large" sx={{ boxShadow: '4px 4px 0px 0px black' }} />
        <BrutalTypography variant="title">
          Il Mio Profilo
        </BrutalTypography>
      </Box>

      {error && (
        <BrutalAlert severity="error" onClose={() => setError('')}>
          {error}
        </BrutalAlert>
      )}

      {success && (
        <BrutalAlert severity="success" sx={{ backgroundColor: '#a3e635' }} onClose={() => setSuccess('')}>
          {success}
        </BrutalAlert>
      )}

      <BrutalCard sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <BrutalTypography variant="heading">
            Dati Personali
          </BrutalTypography>
          {!isEditing && (
            <BrutalButton
              onClick={() => setIsEditing(true)}
              startIcon={<EditIcon />}
              variant="primary"
              sx={{ py: 1, px: 2, fontSize: '0.875rem' }}
            >
              Modifica
            </BrutalButton>
          )}
        </Box>

        {isEditing ? (
          <Box component="form" onSubmit={handleSubmitProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <BrutalInput fullWidth placeholder="NOME" name="firstName" value={formData.firstName} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BrutalInput fullWidth placeholder="COGNOME" name="lastName" value={formData.lastName} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12}>
                <BrutalInput fullWidth placeholder="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12} sm={4}>
                <BrutalInput fullWidth placeholder="DATA DI NASCITA" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12} sm={4}>
                <BrutalInput fullWidth placeholder="PESO (KG)" name="weight" type="number" value={formData.weight} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12} sm={4}>
                <BrutalInput fullWidth placeholder="ALTEZZA (CM)" name="height" type="number" value={formData.height} onChange={handleChange} required  />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <BrutalButton
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
                >
                  Annulla
                </BrutalButton>
                <BrutalButton
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem', flexGrow: 1 }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Salva Modifiche'}
                </BrutalButton>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <ReadOnlyField label="Nome" value={user.firstName} />
            <ReadOnlyField label="Cognome" value={user.lastName} />
            <ReadOnlyField label="Email" value={user.email} />
            <ReadOnlyField label="Data di Nascita" value={new Date(user.birthDate).toLocaleDateString()} />
            <ReadOnlyField label="Peso" value={`${user.weight} kg`} />
            <ReadOnlyField label="Altezza" value={`${user.height} cm`} />
          </Grid>
        )}
      </BrutalCard>

      <BrutalCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isChangingPassword ? 3 : 0 }}>
          <BrutalTypography variant="heading">
            Gestione Password
          </BrutalTypography>
          {!isChangingPassword && (
            <BrutalButton
              onClick={() => setIsChangingPassword(true)}
              startIcon={<KeyIcon />}
              variant="primary"
              sx={{ py: 1, px: 2, fontSize: '0.875rem' }}
            >
              Cambia Password
            </BrutalButton>
          )}
        </Box>

        {isChangingPassword && (
          <Box component="form" onSubmit={handleSubmitPassword}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BrutalInput fullWidth placeholder="VECCHIA PASSWORD" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} required  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BrutalInput fullWidth placeholder="NUOVA PASSWORD" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BrutalInput fullWidth placeholder="CONFERMA NUOVA PASSWORD" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required  />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <BrutalButton
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  variant="secondary"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
                >
                  Annulla
                </BrutalButton>
                <BrutalButton
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem', flexGrow: 1 }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Aggiorna Password'}
                </BrutalButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </BrutalCard>
    </Box>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ borderBottom: '4px solid black', pb: 1 }}>
      <BrutalTypography sx={{ fontWeight: 'bold', color: 'gray', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        {label}
      </BrutalTypography>
      <BrutalTypography sx={{ fontWeight: 900, fontSize: '1.2rem', mt: 0.5, textTransform: 'none' }}>
        {value || '-'}
      </BrutalTypography>
    </Box>
  </Grid>
);


export default ProfilePage;
