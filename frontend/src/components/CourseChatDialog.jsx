import React from 'react';
import ChatRoom from './ChatRoom';
import BrutalDialog, { BrutalDialogTitle, BrutalDialogContent } from './ui/BrutalDialog';

const CourseChatDialog = ({ open, courseId, courseName, onClose }) => {
  return (
    <BrutalDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <BrutalDialogTitle onClose={onClose}>
        Chat: {courseName}
      </BrutalDialogTitle>
      <BrutalDialogContent sx={{ p: 0 }}>
        {courseId && <ChatRoom courseId={courseId} />}
      </BrutalDialogContent>
    </BrutalDialog>
  );
};

export default CourseChatDialog;
