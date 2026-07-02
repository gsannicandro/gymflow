import React from 'react';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { getAvatarColor } from '../utils/avatarUtils';

const UserAvatar = ({ user, size = 36, borderWeight = 4, iconFontSize = 'medium', sx = {} }) => {
  const userId = user?._id || user?.id;
  const color = getAvatarColor(userId);

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        backgroundColor: color,
        border: `${borderWeight}px solid black`,
        color: 'black',
        ...sx
      }}
    >
      <PersonIcon fontSize={iconFontSize} />
    </Avatar>
  );
};

export default UserAvatar;
