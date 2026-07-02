import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import UserAvatar from './UserAvatar';
import Logo from './Logo';
import BrutalButton from './ui/BrutalButton';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Corsi', path: '/courses' },
    { label: 'Macchine', path: '/machines' },
    { label: 'Allenamenti', path: '/workouts' }
  ];

  if (user && user.role === 'owner') {
    navItems.push({ label: 'Dashboard Owner', path: '/owner' });
  }

  if (!user) return null;

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 3, md: 4 },
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '8px solid black',
        backgroundColor: 'white',
        flexShrink: 0
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <Logo size={{ xs: '1.5rem', md: '2rem' }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => (
            <BrutalButton
              key={item.path}
              component={Link}
              to={item.path}
              variant={location.pathname === item.path ? 'primary' : 'secondary'}
              sx={{
                px: 2,
                py: 1,
                fontSize: '0.875rem'
              }}
            >
              {item.label}
            </BrutalButton>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BrutalButton
            onClick={handleMenu}
            variant="secondary"
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1.5,
              px: 2,
              py: 0.5,
              fontSize: '1rem'
            }}
          >
            <UserAvatar user={user} size={36} borderWeight={3} />
            {user.firstName} {user.lastName}
          </BrutalButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              border: '4px solid black',
              boxShadow: '4px 4px 0px 0px black',
              borderRadius: 0
            }
          }}
        >
          <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
              <UserAvatar user={user} size={48} borderWeight={3} iconFontSize="large" />
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    lineHeight: 1
                  }}
                >
                  Il mio Profilo
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'gray', mt: 0.5 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ mt: 1, borderTop: '2px solid black' }}>
            <Typography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
