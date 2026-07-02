import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const liveUrl = process.env.REACT_APP_LIVE_URL || 'http://localhost:5003';
      const token = localStorage.getItem('accessToken');
      
      const newSocket = io(liveUrl, {
        transports: ['websocket', 'polling'],
      });

      // Eseguito quando la connessione al server viene stabilita con successo
      newSocket.on('connect', () => {
        console.log('Socket connesso:', newSocket.id);
        if (token) {
          newSocket.emit('authenticate', { token });
        }
      });

      // Eseguito quando il server conferma che l'autenticazione è riuscita
      newSocket.on('authenticated', (data) => {
        console.log(data.message);
      });

      // Eseguito quando il server rifiuta l'autenticazione del token
      newSocket.on('unauthorized', (data) => {
        console.error('Socket non autorizzato:', data.message);
      });

      // Eseguito quando la connessione con il server viene interrotta
      newSocket.on('disconnect', () => {
        console.log('Socket disconnesso');
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
