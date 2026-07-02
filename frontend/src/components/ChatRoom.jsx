import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { liveApi } from '../api/liveApi';
import UserAvatar from './UserAvatar';
import BrutalInput from './ui/BrutalInput';

const ChatRoom = ({ courseId }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fa scorrere la chat fino all'ultimo messaggio in modo fluido
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = () => {
      if (!courseId || courseId === 'undefined') {
        setLoading(false);
        return;
      }
      setError(null);
      
      liveApi.getChatHistory(courseId)
        .then(response => {
          setMessages(response.data.data || []);
          setError(null);
        })
        .catch(err => {
          console.error('Errore nel caricamento della chat', err);
          setError('Impossibile caricare lo storico della chat.');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchHistory();
  }, [courseId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_course_room', { courseId });

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRoomJoined = (data) => {
      console.log(data.message);
    };

    const handleError = (data) => {
      console.error('Socket error:', data.message);
      setError(data.message);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('room_joined', handleRoomJoined);
    socket.on('error', handleError);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('room_joined', handleRoomJoined);
      socket.off('error', handleError);
    };
  }, [socket, courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      courseId,
      content: newMessage.trim(),
      senderName: user.firstName
    });

    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: user?.id || user?._id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: 'black' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {error && (
          <Typography color="error" sx={{ textAlign: 'center', my: 2 }}>
            {error}
          </Typography>
        )}
        
        {messages.length === 0 && !error && (
          <Typography sx={{ textAlign: 'center', color: 'gray', mt: 4 }}>
            Nessun messaggio. Inizia tu la conversazione!
          </Typography>
        )}

        {messages.map((msg, index) => {
          const senderIdStr = typeof msg.senderId === 'string' ? msg.senderId : (msg.senderId?._id || msg.senderId);
          const isMine = senderIdStr === (user?.id || user?._id);
          const senderName = typeof msg.senderId === 'object' && msg.senderId?.firstName ? msg.senderId.firstName : (msg.senderName || (isMine ? user.firstName : 'Utente'));

          return (
            <Box key={msg._id || index} sx={{ alignSelf: isMine ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', mb: 1, maxWidth: '80%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: isMine ? 'row-reverse' : 'row' }}>
                <UserAvatar user={{ id: senderIdStr }} size={24} borderWeight={2} iconFontSize="small" />
                <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  {senderName}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: isMine ? '#a3e635' : '#f5f5f5',
                  color: 'black',
                  p: 1.5,
                  border: '4px solid black',
                  borderRadius: 0,
                  boxShadow: isMine ? '-5px 5px 0px 0px black' : '5px 5px 0px 0px black',
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      <Divider sx={{ borderWidth: '2px', borderColor: 'black' }} />
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          backgroundColor: 'white',
          display: 'flex',
          gap: 1
        }}
      >
        <BrutalInput
          fullWidth
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value.toUpperCase())}
        />
        <IconButton
          type="submit"
          sx={{
            backgroundColor: 'black',
            color: '#a3e635',
            borderRadius: 0,
            border: '4px solid black',
            '&:hover': {
              backgroundColor: '#a3e635',
              color: 'black'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoom;
