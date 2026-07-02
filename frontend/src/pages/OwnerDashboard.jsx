import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { authApi } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalTypography from '../components/ui/BrutalTypography';
import { BrutalDialog, BrutalDialogTitle, BrutalDialogContent } from '../components/ui/BrutalDialog';
import AppCard from '../components/AppCard';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Fetch dati
  const fetchCodes = () => {
    setLoadingCodes(true);
    authApi.ownerGetCodes()
      .then(response => {
        setCodes(response.data.codes || []);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Errore durante il recupero dei codici trainer');
      })
      .finally(() => {
        setLoadingCodes(false);
      });
  };

  const fetchUsers = () => {
    setLoadingUsers(true);
    authApi.ownerGetUsers()
      .then(response => {
        setUsers(response.data.users || []);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Errore durante il recupero degli utenti');
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    fetchCodes();
    fetchUsers();
  }, []);



  // Crea codice
  const handleCreateCode = () => {
    setError('');
    setSuccess('');
    authApi.ownerCreateCode()
      .then(response => {
        setSuccess('Codice trainer generato con successo: ' + response.data.code.code);
        fetchCodes();
        setTimeout(() => setSuccess(''), 5000);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Errore durante la generazione del codice');
      });
  };

  // Elimina codice
  const handleOpenDeleteCode = (code) => {
    setConfirmConfig({
      title: 'Elimina Codice Trainer',
      message: <>Sei sicuro di voler eliminare il codice trainer inutilizzato <strong>{code.code}</strong>?</>,
      actionText: 'Elimina Codice',
      variant: 'danger',
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isPending: true }));
        authApi.ownerDeleteCode(code._id)
          .then(() => {
            setSuccess('Codice trainer eliminato con successo');
            fetchCodes();
            setConfirmConfig(null);
            setTimeout(() => setSuccess(''), 3000);
          })
          .catch(err => {
            setError(err.response?.data?.message || "Errore durante l'eliminazione del codice");
            setConfirmConfig(null);
          });
      }
    });
  };

  // Elimina utente
  const handleOpenDeleteUser = (u) => {
    setConfirmConfig({
      title: 'Conferma Eliminazione',
      message: <>Sei sicuro di voler eliminare l'utente <strong>{u.firstName} {u.lastName}</strong> ({u.email})? Questa azione è irreversibile.</>,
      actionText: 'Conferma ed Elimina',
      variant: 'danger',
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isPending: true }));
        authApi.ownerDeleteUser(u._id)
          .then(() => {
            setSuccess(`Utente ${u.firstName} ${u.lastName} eliminato dal sistema`);
            fetchUsers();
            setConfirmConfig(null);
            setTimeout(() => setSuccess(''), 3000);
          })
          .catch(err => {
            setError(err.response?.data?.message || "Errore durante l'eliminazione dell'utente");
            setConfirmConfig(null);
          });
      }
    });
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT') + ' ' + date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '8px solid black' }}>
        <BrutalTypography variant="title">
          Dashboard Owner
        </BrutalTypography>
      </Box>

      {error && (
        <BrutalAlert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
          {error}
        </BrutalAlert>
      )}
      {success && (
        <BrutalAlert severity="success" sx={{ backgroundColor: '#a3e635', mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </BrutalAlert>
      )}

      <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <BrutalTypography variant="heading">
              Codici monouso trainer
            </BrutalTypography>
            <BrutalButton 
              onClick={handleCreateCode}
              variant="primary"
              sx={{ px: 3, py: 1.5, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AddIcon /> Genera Codice
            </BrutalButton>
          </Box>

          {loadingCodes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'black' }} />
            </Box>
          ) : codes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, fontWeight: 'bold' }}>
              Nessun codice trainer presente. Generane uno nuovo!
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {codes.map((c) => (
                <AppCard
                  key={c._id}
                  header={{
                    text: c.isUsed ? 'USATO' : 'DISPONIBILE',
                    bgColor: c.isUsed ? '#ef5350' : '#a3e635'
                  }}
                  body={{
                    icon: <VpnKeyIcon sx={{ fontSize: 30 }} />,
                    title: c.code,
                    details: c.isUsed && c.usedBy ? [
                      { icon: <PersonIcon />, text: `${c.usedBy.firstName} ${c.usedBy.lastName}` },
                      { icon: <EventIcon />, text: formatDate(c.usedAt) }
                    ] : [
                      { text: 'Pronto per essere inviato a un nuovo trainer.' }
                    ]
                  }}
                  footer={{
                    actions: !c.isUsed ? [
                      <BrutalButton
                        key="delete"
                        variant="danger"
                        onClick={() => handleOpenDeleteCode(c)}
                        sx={{ py: 1.5, width: '100%' }}
                      >
                        <DeleteIcon sx={{ mr: 1 }} /> Elimina
                      </BrutalButton>
                    ] : []
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

      <Box sx={{ mb: 6 }}>
          <Box sx={{ mb: 3 }}>
            <BrutalTypography variant="heading">
              Lista utenti registrati
            </BrutalTypography>
          </Box>

          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'black' }} />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {users.map((u) => {
                const isRemoved = u.isActive === false;
                const roleColors = { owner: '#d9f99d', trainer: '#fed7aa', user: '#e2e8f0' };
                const roleLabels = { owner: 'Owner', trainer: 'Trainer', user: 'Utente' };
                
                return (
                  <AppCard
                    key={u._id}
                    header={{
                      text: isRemoved ? 'RIMOSSO' : roleLabels[u.role] || 'UTENTE',
                      bgColor: isRemoved ? '#9ca3af' : (roleColors[u.role] || '#eee'),
                      action: (!isRemoved && u._id !== user?.id && u.role !== 'owner') ? (
                        <BrutalButton
                          variant="danger"
                          onClick={() => handleOpenDeleteUser(u)}
                          sx={{ p: 1, minWidth: 'auto', lineHeight: 0 }}
                          title="Elimina utente"
                        >
                          <DeleteIcon fontSize="small" />
                        </BrutalButton>
                      ) : null
                    }}
                    body={{
                      icon: <PersonIcon sx={{ fontSize: 30 }} />,
                      title: `${u.firstName} ${u.lastName}`,
                      subtitle: u.email,
                      details: [
                        { icon: <EventIcon />, text: `Reg: ${formatDate(u.createdAt)}` }
                      ]
                    }}
                  />
                );
              })}
            </Box>
          )}
        </Box>

      {confirmConfig && (
        <BrutalDialog open={true} onClose={() => setConfirmConfig(null)}>
          <BrutalDialogTitle onClose={() => setConfirmConfig(null)}>
            {confirmConfig.title}
          </BrutalDialogTitle>
          <BrutalDialogContent>
            <BrutalTypography sx={{ mb: 4, textTransform: 'none' }}>
              {confirmConfig.message}
            </BrutalTypography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <BrutalButton 
                variant="secondary" 
                onClick={() => setConfirmConfig(null)}
                sx={{ fontSize: '0.9rem', py: 1 }}
              >
                Annulla
              </BrutalButton>
              <BrutalButton 
                variant={confirmConfig.variant || 'primary'} 
                onClick={confirmConfig.onConfirm}
                disabled={confirmConfig.isPending}
                sx={{ fontSize: '0.9rem', py: 1 }}
              >
                {confirmConfig.isPending ? 'Attendere...' : confirmConfig.actionText}
              </BrutalButton>
            </Box>
          </BrutalDialogContent>
        </BrutalDialog>
      )}
    </Box>
  );
};

export default OwnerDashboard;
